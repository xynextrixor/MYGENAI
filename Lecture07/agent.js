import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import fs from "fs";
import path from "path";


if (!process.env.GEMINI_API_KEY) {
  console.error(" Error: GEMINI_API_KEY not found in .env");
  console.error("Add GEMINI_API_KEY=your_key_here to .env file");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================
// TOOL FUNCTIONS
// ============================================

async function listFiles({ directory }) {
  const files = [];
  const extensions = [".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".md"];

  function scan(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      // Skip node_modules, dist, build
      if (
        fullPath.includes("node_modules") ||
        fullPath.includes("dist") ||
        fullPath.includes("build")
      )
        continue;

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  scan(directory);
  console.log(`Found ${files.length} files`);
  return { files };
}
async function readFile({ file_path }) {
  const content = fs.readFileSync(file_path, "utf-8");
  console.log(`Reading: ${file_path}`);
  return { content };
}
async function writeFile({ file_path, content }) {
  fs.writeFileSync(file_path, content, "utf-8");
  console.log(`✍️  Fixed: ${file_path}`);
  return { success: true };
}
async function createReadmeFile({ file_path, content }) {
  fs.writeFileSync(file_path, content, "utf-8");
  console.log(`📄 README created: ${file_path}`);
  return { success: true, file_path };
}
// ============================================
// TOOL REGISTRY
// ============================================

const tools = {
  list_files: listFiles,
  read_file: readFile,
  write_file: writeFile,
  create_readme: createReadmeFile,
  Create_Readme: createReadmeFile,
};

// ============================================
// TOOL DECLARATIONS
// ============================================

const listFilesTool = {
  name: "list_files",
  description: "Get all JavaScript files in a directory",
  parameters: {
    type: Type.OBJECT,
    properties: {
      directory: {
        type: Type.STRING,
        description: "Directory path to scan",
      },
    },
    required: ["directory"],
  },
};

const readFileTool = {
  name: "read_file",
  description: "Read a file's content",
  parameters: {
    type: Type.OBJECT,
    properties: {
      file_path: {
        type: Type.STRING,
        description: "Path to the file",
      },
    },
    required: ["file_path"],
  },
};

const writeFileTool = {
  name: "write_file",
  description: "Write fixed content back to a file",
  parameters: {
    type: Type.OBJECT,
    properties: {
      file_path: {
        type: Type.STRING,
        description: "Path to the file to write",
      },
      content: {
        type: Type.STRING,
        description: "The fixed/corrected content",
      },
    },
    required: ["file_path", "content"],
  },
};
const createReadmeTool = {
  name: "create_readme",
  description: "Create a README file after the review is complete",
  parameters: {
    type: Type.OBJECT,
    properties: {
      file_path: {
        type: Type.STRING,
        description: "Path to the README file",
      },
      content: {
        type: Type.STRING,
        description: "The README content to write",
      },
    },
    required: ["file_path", "content"],
  },
};



// ============================================
// MAIN FUNCTION
// ============================================

export async function runAgent(directoryPath) {
  console.log(` Reviewing: ${directoryPath}\n`);

  const History = [
    {
      role: "user",
      parts: [
        { text: `Review and fix all JavaScript code in: ${directoryPath}` },
      ],
    },
  ];

  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `You are an expert JavaScript code reviewer and fixer.

**Your Job:**
1. Use list_files to get all HTML, CSS, JavaScript, and TypeScript files in the directory
2. Use read_file to read each file's content
3. Analyze for:
   
   **HTML Issues:**
   - Missing doctype, meta tags, semantic HTML
   - Broken links, missing alt attributes
   - Accessibility issues (ARIA, roles)
   - Inline styles that should be in CSS
   
   **CSS Issues:**
   - Syntax errors, invalid properties
   - Browser compatibility issues
   - Inefficient selectors
   - Missing vendor prefixes
   - Unused or duplicate styles
   
   **JavaScript Issues:**
   - BUGS: null/undefined errors, missing returns, type issues, async problems
   - SECURITY: hardcoded secrets, eval(), XSS risks, injection vulnerabilities
   - CODE QUALITY: console.logs, unused code, bad naming, complex logic

4. Use write_file to FIX the issues you found (write corrected code back)
5. After fixing all files, respond with a summary report in TEXT format

**Summary Report Format:**
📊 CODE REVIEW COMPLETE

Total Files Analyzed: X
Files Fixed: Y

🔴 SECURITY FIXES:
- file.js:line - Fixed hardcoded API key
- auth.js:line - Removed eval() usage

🟠 BUG FIXES:
- app.js:line - Added null check for user object
- index.html:line - Added missing alt attribute

🟡 CODE QUALITY IMPROVEMENTS:
- styles.css:line - Removed duplicate styles
- script.js:line - Removed console.log statements

Be practical and focus on real issues. Actually FIX the code, don't just report.`,
        tools: [
          {
            functionDeclarations: [listFilesTool, readFileTool, writeFileTool, createReadmeTool],
          },
        ],
      },
    });

    // Process ALL function calls at once
    if (result.functionCalls?.length > 0) {
      // Execute all function calls
      for (const functionCall of result.functionCalls) {
        const { name, args } = functionCall;

        console.log(`📌 ${name}`);
        const toolResponse = await tools[name](args);

        // Add function call to history
        History.push({
          role: "model",
          parts: [{ functionCall }],
        });

        // Add function response to history
        History.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name,
                response: { result: toolResponse },
              },
            },
          ],
        });
      }
    } else {
      console.log("\n" + result.text);
      break;
    }
  }

  const targetPath = path.join(path.resolve(directoryPath), "README.md");
  const projectName = path.basename(path.resolve(directoryPath));
  const filesResult = await listFiles({ directory: path.resolve(directoryPath) });
  const fileList = filesResult.files
    .map((file) => `- ${path.relative(path.resolve(directoryPath), file)}`)
    .slice(0, 20)
    .join("\n");

  const readmeContent = `# ${projectName}\n\nThis project was reviewed and fixed by the AI agent.\n\n## What was done\n- Reviewed JavaScript, HTML, CSS, and TypeScript files\n- Fixed common bugs and code quality issues\n- Prepared a summary of the improvements\n\n## Files found\n${fileList || "- No files found"}\n`;

  await createReadmeFile({ file_path: targetPath, content: readmeContent });
}

// node agent.js ../tester

const directory = process.argv[2] || ".";

await runAgent(directory);
