// // FILE: src/app/api/save-lead/route.ts

// import { NextResponse } from "next/server";

// interface LeadData {
//   name: string;
//   email: string;
//   businessType: string;
//   socials?: string;
//   revenue?: string;
//   goals: string;
//   timestamp: string;
//   source: string;
// }

// export async function POST(request: Request) {
//   // Retrieve environment variables
//   const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
//   const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
//   const TABLE_NAME = "Table 1"; // Make sure this matches your table name in Airtable

//   if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
//     console.error("Airtable environment variables are not set.");
//     return NextResponse.json(
//       { error: "Server configuration error." },
//       { status: 500 }
//     );
//   }

//   try {
//     const body: LeadData = await request.json();

//     // The Airtable REST API expects the data in a specific format:
//     // { "records": [ { "fields": { ... } } ] }
//     const airtableData = {
//       records: [
//         {
//           fields: {
//             Name: body.name,
//             email: body.email,
//             "business type": body.businessType,
//             "Social Media": body.socials || "",
//             "Revenue Range": body.revenue || "",
//             Goals: body.goals,
//             Timestamp: body.timestamp,
//             Source: body.source,
//             Status: "New Lead",
//           },
//         },
//       ],
//     };

//     const response = await fetch(
//       `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(airtableData),
//       }
//     );

//     // If the response from Airtable is not OK, log the error and return it
//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Airtable API error:", errorData);
//       return NextResponse.json(
//         { error: "Failed to save lead to Airtable.", details: errorData },
//         { status: response.status }
//       );
//     }

//     const responseData = await response.json();
//     console.log("Lead saved successfully via fetch:", responseData);

//     return NextResponse.json({ success: true, record: responseData });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
//   }
// }

// FILE: src/app/api/save-lead/route.ts

import { NextResponse } from "next/server"; // <-- Import NextResponse
import Airtable from "airtable";

// This part remains the same
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

interface LeadData {
  name: string;
  email: string;
  businessType: string;
  socials?: string;
  revenue?: string;
  goals: string;
  timestamp: string;
  source: string;
}

// The main handler is now a named 'POST' export and is async
export async function POST(request: Request) {
  try {
    // 1. Get the body by awaiting the .json() method on the request
    const body: LeadData = await request.json();

    // 2. The saveLead logic can be simplified and used with await
    const {
      name,
      email,
      businessType,
      socials,
      revenue,
      goals,
      timestamp,
      source,
    } = body;
    const table = base("Table 1");

    // The Airtable SDK uses callbacks, so we wrap it in a promise to use await
    const record = await new Promise((resolve, reject) => {
      table.create(
        {
          Name: name,
          email: email,
          "business type": businessType,
          "social media": socials || "",
          "monthly revenue range": revenue || "",
          goals: goals,
          //   Source: source,
          status: "New Lead",
        },
        function (err: any, rec: any) {
          if (err) {
            console.error("Airtable error:", err);
            reject(err);
            return;
          }
          resolve(rec);
        }
      );
    });

    console.log("Lead saved successfully:", (record as any).getId());

    // 3. Return a successful response using NextResponse
    return NextResponse.json({ success: true, record: record });
  } catch (error) {
    console.error("Error saving lead:", error);
    // 4. Return an error response using NextResponse, including a status code
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
