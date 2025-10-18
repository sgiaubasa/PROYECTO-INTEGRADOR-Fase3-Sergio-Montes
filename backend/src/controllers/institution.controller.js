import ErrorService from "../services/error.service.js";
import InstitutionService from "../services/institution.service.js";

export default class InstitutionController {
    #institutionService;

    constructor() {
        this.#institutionService = new InstitutionService();
    }

    async findFirst(req, res) {
        try {
            const institution = await this.#institutionService.findFirst();

            res.status(200).json({ status: "success", payload: institution });
        } catch (error) {
            const handledError = ErrorService.handleError(error);
            res.status(handledError.code).json({ status: "error", message: handledError.message });
        }
    }
}