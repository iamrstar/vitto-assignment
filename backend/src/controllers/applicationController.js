const db = require('../config/db');

exports.createApplication = async (req, res) => {
  const { name, mobile, amount, purpose, language } = req.body;

  // validate input
  if(!name || !mobile || !amount || !purpose || !language) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO applications (name, mobile, amount, purpose, language) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, mobile, amount, purpose, language]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getApplications = async (req, res) => {
  const { status } = req.query;
  
  try {
    let query = 'SELECT * FROM applications';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    // sort by latest
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const totalAppsResult = await db.query('SELECT COUNT(*) FROM applications');
    const totalAmountResult = await db.query('SELECT SUM(amount) FROM applications');
    const statusCountsResult = await db.query('SELECT status, COUNT(*) FROM applications GROUP BY status');

    const totalApps = parseInt(totalAppsResult.rows[0].count, 10) || 0;
    const totalAmount = parseFloat(totalAmountResult.rows[0].sum) || 0;
    
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    statusCountsResult.rows.forEach(row => {
      statusCounts[row.status] = parseInt(row.count, 10);
    });

    res.status(200).json({
      totalApps,
      totalAmount,
      statusCounts
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
