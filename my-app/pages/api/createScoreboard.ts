import { CreateScoreboardRequest } from "@/app/interfaces/CreateScoreboardRequest";
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';


export default async function handler(req: any, res: any) {
    try {

        const request: CreateScoreboardRequest = req.body;

        console.log("yay!")

        console.log(request);

        const imagePath = path.resolve('./public/images/sample.jpg'); // Path to your image
        const outputImagePath = path.resolve('./public/images/output.jpg'); // Path for the new image

        const svgText = `<svg width="500" height="500">
        <style>
          .title { fill: #fff; font-size: 48px; text-anchor: middle; font-family: "Roboto";}
          .header { fill: #fff; font-size: 36px; text-anchor: middle; font-weight: bold; font-family: "Roboto";}
        </style>
        <text x="250" y="30" class="header">Players</text>
        <text x="250" y="70" class="header"># of beers</text>
        <text x="250" y="120" class="title">${request.ScoreRows[0].Name}</text>
      </svg>`;

        const image = await sharp(imagePath)
            .composite([
                {
                    input: Buffer.from(svgText),
                    top: 0,
                    left: 0,
                }
            ])
            .toFile(outputImagePath); // Saving the processed image to a file

        res.status(200).json({ message: 'Image processed and saved successfully', path: '/output.jpg' });

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            errorMessage: "Unable to send email.",

        });
    }
}