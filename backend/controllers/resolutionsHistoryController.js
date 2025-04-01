const sql = require('mssql');

exports.getResolutionsHistory = async (req, res) => {
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Resolutions_History`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.getResolutionHistoryById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Resolutions_History
                                       WHERE complaint_id = ${id}
                                       ORDER BY UPDATED_AT DESC`;
        if (result.recordset.length === 0) {
            return res.status(404).json({error: 'Resolution history not found'});
        }
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.createResolutionHistory = async (req, res) => {
    const {
        resolution_id,
        complaint_id,
        status,
        action_taken,
        resolution_proof_path,
        resolution_date,
        updated_at,
        remarks
    } = req.body;

    if (!resolution_id || !complaint_id || !status || !remarks) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try {
        await sql.query`
            INSERT INTO dbo.Resolutions_History (resolution_id, complaint_id, status, action_taken,
                                                 resolution_proof_path, resolution_date, updated_at, remarks)
            VALUES (${resolution_id}, ${complaint_id}, ${status}, ${action_taken},
                    ${resolution_proof_path != null ? resolution_proof_path.toString() : ''},
                    ${resolution_date}, ${updated_at}, ${remarks})
        `;
        res.status(201).json({message: 'Resolution history inserted successfully'});
    } catch (err) {
        console.error('Error inserting resolution history into the database: ', err);
        res.status(500).json({error: 'Error inserting resolution history into the database'});
    }
};
