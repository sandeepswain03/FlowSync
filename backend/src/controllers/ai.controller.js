import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { generateResult } from "../utils/aiService.js";

const getResult = asyncHandler(async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) {
        throw new apiError(400, "Prompt is required");
    }
    const result = await generateResult(prompt);
    res.json(new apiResponse(200, result, "Result fetched successfully", []));
});

export { getResult };
