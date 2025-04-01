const sql = require('mssql');

exports.getResolutions = async (req, res) => {
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Resolutions`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.getResolutionById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Resolutions
                                       WHERE resolution_id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({error: 'Resolution not found'});
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.updateResolution = async (req, res) => {
    const {
        complaint_id,
        resolution_id,
        status,
        action_taken,
        resolution_date,
        resolution_proof_path,
        remarks
    } = req.body;

    if (!complaint_id || !resolution_id || !status || !action_taken || !resolution_date) {
        return res.status(400).json({error: 'Missing required fields'});
    }
    console.log("Received data in backend:", req.body);
    console.log("Type of resolution_proof_path:", typeof resolution_proof_path);
    console.log("resolution_proof_path value:", resolution_proof_path);

    const proofArray = typeof resolution_proof_path === "string" ? JSON.parse(resolution_proof_path) : resolution_proof_path;
    const resolutionProofsJson = JSON.stringify(proofArray);


    try {
        //Update Resolutions table
        await sql.query`
            UPDATE dbo.Resolutions
            SET status                = ${status},
                action_taken          = ${action_taken},
                resolution_date       = ${resolution_date},
                resolution_proof_path = CAST(${resolutionProofsJson} AS NVARCHAR(MAX))
            WHERE complaint_id = ${complaint_id};

        `;

        //Insert Into Resolutions _history table
        // Insert into Resolutions_History table
        const result = await sql.query`
            INSERT INTO dbo.Resolutions_History (resolution_id,
                                                 complaint_id,
                                                 status,
                                                 action_taken,
                                                 resolution_proof_path,
                                                 resolution_date,
                                                 updated_at,
                                                 remarks)
                OUTPUT INSERTED.*
            VALUES (${resolution_id}, ${complaint_id}, ${status}, ${action_taken}, CAST (${resolutionProofsJson} AS NVARCHAR(MAX)), ${resolution_date}, GETDATE(), ${remarks != null ? remarks : ''});
        `;
        console.log("Resolutions_History table insertion result:", result);
        res.status(201).json({message: 'Resolution inserted successfully'});
    } catch (err) {
        console.error('Error inserting resolution into the database: ', err);
        res.status(500).json({error: 'Error inserting resolution into the database'});
    }
};