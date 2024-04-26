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


        let basePath = process.cwd()
        if (process.env.NODE_ENV === 'production') {
            basePath = path.join(process.cwd(), '.next/server/chunks')
        }

        path.resolve(basePath, 'fonts', 'fonts.conf')
        path.resolve(basePath, 'fonts', 'Jersey15-Regular.ttf')


        const svgText = `<svg width="500" height="200">
        <style type="text/css">
          @font-face {
            font-family: Jersey 15 Regular;
            src: './fonts/Jersey15-Regular.ttf';
          }
        </style>
        <text x="0" y="0" font-family="Arial Bold" font-size="48" font-weight="bold" letter-spacing="-0.7">
          <tspan x="0" dy="1.2em">Lorem Ipsum</tspan>
          <tspan x="0" dy="1.2em" dx=".4em" fill="#6356fd">dolor sit</tspan> <tspan dx=".05em">amet.</tspan>
        </text>
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