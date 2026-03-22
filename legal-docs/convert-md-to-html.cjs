#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter (basic support)
function markdownToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Links
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
        // Lists
        .replace(/^\* (.+)$/gim, '<li>$1</li>')
        .replace(/^- (.+)$/gim, '<li>$1</li>')
        // Paragraphs
        .split('\n\n')
        .map(para => {
            if (para.startsWith('<h') || para.startsWith('<li>')) return para;
            if (para.includes('<li>')) return `<ul>${para}</ul>`;
            return para.trim() ? `<p>${para.trim()}</p>` : '';
        })
        .join('\n');

    return html;
}

function createHtmlPage(title, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - The Climate Note</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.8;
            color: #1f2937;
            background: #f9fafb;
            padding: 2rem 1rem;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 3rem 2.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        h1 {
            color: #059669;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 3px solid #059669;
        }

        h2 {
            color: #047857;
            font-size: 1.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }

        h3 {
            color: #065f46;
            font-size: 1.2rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }

        p {
            margin-bottom: 1rem;
            color: #374151;
        }

        ul, ol {
            margin-left: 2rem;
            margin-bottom: 1rem;
        }

        li {
            margin-bottom: 0.5rem;
            color: #374151;
        }

        strong {
            color: #059669;
            font-weight: 600;
        }

        a {
            color: #059669;
            text-decoration: none;
            border-bottom: 1px solid #d1fae5;
            transition: border-color 0.2s;
        }

        a:hover {
            border-bottom-color: #059669;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 2rem;
            padding: 0.5rem 1rem;
            background: #f0fdf4;
            border-radius: 8px;
            color: #059669;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.2s;
        }

        .back-link:hover {
            background: #dcfce7;
            border: none;
        }

        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
        }

        @media (max-width: 640px) {
            .container {
                padding: 2rem 1.5rem;
            }

            h1 {
                font-size: 1.75rem;
            }

            h2 {
                font-size: 1.3rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to Legal Documents</a>
        ${content}
        <div class="footer">
            <p>Questions? Contact us at <a href="mailto:support@theclimatenote.app">support@theclimatenote.app</a></p>
        </div>
    </div>
</body>
</html>`;
}

// Convert privacy policy
const privacyMd = fs.readFileSync(path.join(__dirname, '..', 'privacy-policy.md'), 'utf8');
const privacyHtml = createHtmlPage('Privacy Policy', markdownToHtml(privacyMd));
fs.writeFileSync(path.join(__dirname, 'privacy-policy.html'), privacyHtml);

// Convert terms of service
const termsMd = fs.readFileSync(path.join(__dirname, '..', 'terms-of-service.md'), 'utf8');
const termsHtml = createHtmlPage('Terms of Service', markdownToHtml(termsMd));
fs.writeFileSync(path.join(__dirname, 'terms-of-service.html'), termsHtml);

console.log('✅ Successfully converted markdown files to HTML');
console.log('   - privacy-policy.html');
console.log('   - terms-of-service.html');
