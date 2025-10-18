import ErrorService from "../services/error.service.js";
import InquiryService from "../services/inquiry.service.js";
import { validateSendInquiry } from "../validators/inquiry.validator.js";

class InquiryController {
    #inquiryService;

    constructor() {
        this.inquiryService = new InquiryService();
    }

    async sendMail(req, res) {
        try {
            const values = validateSendInquiry(req.body);
            await this.#inquiryService.sendInquiry(values);
            res.status(204).send();
        } catch (error) {
            const handledError = ErrorService.handleError(error);
            res.status(handledError.code).json({ status: "error", message: handledError.message });
        }
    }
}

export default new InquiryController();