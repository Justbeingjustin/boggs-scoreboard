import { CreateScoreboardRequest } from "@/app/interfaces/CreateScoreboardRequest";
import Jimp from 'jimp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import request from 'request';
import GIFEncoder from 'gif-encoder-2';
import fs from 'fs';

export default async function handler(req: any, res: any) {
    try {
        const r: CreateScoreboardRequest = req.body;
        const guid = uuidv4();
        const fontPath = path.resolve("./assets/open-sans-32-white.fnt");
        const font = await Jimp.loadFont(fontPath);

        const numFrames = 16; // Number of images
        const frameDelay = 100; // Delay in ms
        const width = 500; // Width of the GIF
        const height = 314; // Height of the GIF
        const encoder = new GIFEncoder(width, height);

        // Start the GIF
        encoder.start();
        encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
        encoder.setDelay(frameDelay);
        encoder.setQuality(10); // Image quality (10 is default)

        for (let i = 1; i <= numFrames; i++) {
            const imagePath = path.resolve(`./public/images/${i}.jpg`);
            const image = await Jimp.read(imagePath);
            image.print(font, 75, 50, "Players", 500);
            image.print(font, 300, 50, "# of Beers", 1500);
            let y = 100;
            const lineHeight = 40;
            const sortedScoreRows = r.ScoreRows.slice().sort((a, b) => b.Score - a.Score);
            for (const scoreRow of sortedScoreRows) {
                image.print(font, 75, y, scoreRow.Name);
                image.print(font, 350, y, scoreRow.Score.toString());
                y += lineHeight;
            }
            const bitmap = image.bitmap.data;
            encoder.addFrame(bitmap);
        }
        encoder.finish();

        const gifBuffer = encoder.out.getData();




        // Set up options for the upload
        const options = {
            method: 'POST',
            url: 'https://api.app.pixelgreet.com/Image/UploadImage2',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            formData: {
                'Image': {
                    value: gifBuffer,
                    options: {
                        filename: `${guid}.gif`,
                        contentType: 'image/gif'
                    }
                },
                'FileName': guid
            }
        };

        // Upload the image
        request(options, function (error, response, body) {
            if (error) {
                console.error("Upload error:", error);
                return res.status(500).json({ url: "", errorMessage: error.message, success: false });
            }
            console.log("GIF uploaded:", body);
            return res.status(200).json({ url: body, errorMessage: "", success: true });
        });

    } catch (error: any) {
        console.error("Handler error:", error);
        return res.status(200).json({ url: "", errorMessage: error.toString, success: false });
    }
}
