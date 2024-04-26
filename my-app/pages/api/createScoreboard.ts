import { CreateScoreboardRequest } from "@/app/interfaces/CreateScoreboardRequest";
import Jimp from 'jimp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import request from 'request'; // Consider using modern alternatives like 'axios' or 'node-fetch'

export default async function handler(req: any, res: any) {
    try {
        const r: CreateScoreboardRequest = req.body;
        const imagePath = path.resolve('./public/images/1.jpg'); // Path to your image
        const guid = uuidv4();


        //const plugin = require.resolve('@jimp/plugin-print');
        const fontPath = path.resolve("./assets/open-sans-32-white.fnt")
        const fontPathSmall = path.resolve("./assets/open-sans-32-white.fnt")

        console.info("Image path:", imagePath);

        // Load the image using Jimp
        const image = await Jimp.read(imagePath);

        console.log(fontPath);


        const font = await Jimp.loadFont(fontPath);
        const fontSmall = await Jimp.loadFont(fontPathSmall);



        image.print(font, 75, 50, "Players", 500); // Ensure your text fits within the image width
        image.print(font, 300, 50, "# of Beers", 1500);
        let y = 100;
        const lineHeight = 40; // Change this to the desired line height
        const sortedScoreRows = r.ScoreRows.slice().sort((a, b) => b.Score - a.Score);
        for (const scoreRow of sortedScoreRows) {
            image.print(fontSmall, 75, y, scoreRow.Name);
            image.print(fontSmall, 350, y, scoreRow.Score);
            y += lineHeight;
        }
        // Get image buffer
        const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Set up options for the upload
        const options = {
            method: 'POST',
            url: 'https://api.app.pixelgreet.com/Image/UploadImage2',
            headers: {},
            formData: {
                'Image': {
                    'value': imageBuffer,
                    'options': {
                        'filename': `${guid}.jpg`,
                        'contentType': 'image/jpeg'
                    }
                },
                'FileName': guid
            }
        };

        // Upload the image
        request(options, function (error: any, response: any) {
            if (error) throw new Error(error);
            console.log("Image uploaded:", response.body);
            return res.status(200).json({ url: response.body, errorMessage: "", success: true });
        });

    } catch (error: any) {
        console.error("Handler error:", error);
        return res.status(200).json({ url: "", errorMessage: error, success: false });
    }
}