const sql = require('mssql');
const server = require('../server');

exports.getComplaints = async (req, res) => {
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Complaint`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.getComplaintById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await sql.query`SELECT c.complaint_id,
                                              c.created_at,
                                              c.newspaper_name,
                                              c.publication_date,
                                              c.issue_category,
                                              c.issue_description,
                                              c.deadline_dt,
                                              r.resolution_id,
                                              r.status,
                                              r.action_taken,
                                              r.resolution_proof_path,
                                              r.resolution_date
                                       FROM DBO.COMPLAINT c,
                                            DBO.RESOLUTIONS r
                                       WHERE c.complaint_id = r.complaint_id
                                         AND c.complaint_id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({error: 'Complaint not found'});
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.createComplaint = async (req, res) => {
    const {newspaper_name, publication_date, issue_category, issue_description, deadline_dt} = req.body;

    if (!newspaper_name || !publication_date || !issue_category || !issue_description || !deadline_dt) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try {
        const result = await sql.query`
            INSERT INTO dbo.Complaint (newspaper_name, publication_date, issue_category, issue_description, deadline_dt)
                OUTPUT INSERTED.*
            VALUES (${newspaper_name}, ${publication_date}, ${issue_category}, ${issue_description}, ${deadline_dt})
        `;
        const insertedComplaintId = result?.recordset?.[0]?.complaint_id;

        if (!insertedComplaintId) {
            throw new Error("Failed to retrieve inserted complaint ID.");
        }

        // Insert into Resolutions table
        const result_1 = await sql.query`
            INSERT INTO dbo.Resolutions (complaint_id, status, action_taken, resolution_date, resolution_proof_path)
                OUTPUT INSERTED.*
            VALUES (${insertedComplaintId}, 'Pending', '', NULL, NULL)
        `;
        const insertedResolutionId = result_1?.recordset?.[0]?.resolution_id;

        if (!insertedResolutionId) {
            throw new Error("Failed to retrieve inserted resolution ID.");
        }

        // Insert into Resolutions_History table
        await sql.query`
            INSERT INTO dbo.Resolutions_History (resolution_id, complaint_id, status, action_taken,
                                                 resolution_proof_path, resolution_date, remarks)

            VALUES (${insertedResolutionId}, ${insertedComplaintId}, 'Pending', NULL, '', NULL, '')
        `;

        // Notify all connected clients
        server.notifyClients({
            id: insertedComplaintId,
            newspaper_name,
            publication_date,
            issue_category,
            issue_description,
            deadline_dt
        });

        res.status(201).json({message: 'Complaint inserted successfully'});
    } catch (err) {
        console.error('Error inserting complaint into the database: ', err);
        res.status(500).json({error: 'Error inserting complaint into the database'});
    }
};

exports.getPendingComplaints = async (req, res) => {
    try {
        //TODO: update query to fetch pending records
        const result = await sql.query`SELECT DISTINCT CAST(C.COMPLAINT_ID AS INT) AS complaint_id,
                                                       C.issue_category,
                                                       C.issue_description,
                                                       C.newspaper_name,
                                                       C.publication_date,
                                                       C.created_at,
                                                       C.deadline_dt,
                                                       R.status
                                       FROM DBO.COMPLAINT C
                                                JOIN DBO.RESOLUTIONS R ON C.COMPLAINT_ID = R.COMPLAINT_ID
                                       WHERE R.STATUS NOT IN ('Resolved')

        `
        console.log(result.recordset)
        const pendingComplaints = result.recordset;

        if (pendingComplaints.length === 0) {
            return res.status(404).json({message: 'No pending complaints found'});
        }

        res.json(pendingComplaints);
    } catch (error) {
        console.error("Error fetching pending complaints:", error);
        res.status(500).json({message: 'Server error'});
    }
};
