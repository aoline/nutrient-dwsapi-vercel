module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const extractTables = req.body && req.body.extractTables === 'true';
    const extractKeyValuePairs = req.body && req.body.extractKeyValuePairs === 'true';

    // Simple test response
    res.json({
      success: true,
      data: {
        text: "Mock extracted text from uploaded file",
        tables: extractTables ? [{ headers: ['Column 1', 'Column 2'], rows: [['Data 1', 'Data 2']] }] : [],
        keyValuePairs: extractKeyValuePairs ? { 'Key 1': 'Value 1', 'Key 2': 'Value 2' } : {}
      }
    });

  } catch (error) {
    console.error('Extraction Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}; 