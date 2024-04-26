import { CreateScoreboardRequest } from "@/app/interfaces/CreateScoreboardRequest";
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


export default async function handler(req: any, res: any) {
    try {

        const request: CreateScoreboardRequest = req.body;


        const imagePath = path.resolve('./public/images/sample.jpg'); // Path to your image

        const guid = uuidv4();

        path.resolve(process.cwd(), 'fonts', 'fonts.conf');
        path.resolve(process.cwd(), 'fonts', 'Jersey15-Regular.ttf');


        const svgText = `<svg width="500" height="500">
        <style>
          .title { fill: #fff; font-size: 48px; text-anchor: middle; font-family: "Jersey15-Regular";}
          .header { fill: #fff; font-size: 36px; text-anchor: middle; font-weight: bold; font-family: "Jersey15-Regular";}
        </style>
        <text x="250" y="30" class="header">Players</text>
        <text x="250" y="70" class="header"># of beers</text>
        <text x="250" y="120" class="title">${request.ScoreRows[0].Name}</text>
      </svg>`;

        const imageBuffer = await sharp(imagePath)
            .composite([
                { input: Buffer.from(svgText, 'utf-8'), top: 0, left: 0 }
            ])
            .jpeg() // Output as PNG (or jpeg, webp, etc.)
            .toBuffer();




        var request2 = require('request');
        var fs = require('fs');
        var options = {
            'method': 'POST',
            'url': 'https://api.app.pixelgreet.com/Image/UploadImage2',
            'headers': {
            },
            formData: {
                'Image': {
                    'value': imageBuffer, // Updated to use the new image path
                    'options': {
                        'filename': `${guid}.jpg`,
                        'contentType': null
                    }
                },
                'FileName': guid
            }
        };
        request2(options, function (error: any, response: any) {
            if (error) throw new Error(error);
            console.log(response.body);
            console.log("yay!!!")
            res.status(200).json({ url: response.body, errorMessage: "", success: true });
            return;
        });


    } catch (error) {
        console.log(error);
        return res.status(200).json({ url: "", errorMessage: "an error occured", success: false });

    }
}