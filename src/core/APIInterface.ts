import axios from "axios";

class APIInterface {
    private readonly _baseUrl: string;

    constructor() {
        this._baseUrl = "https://us-central1-ceres-platform-test.cloudfunctions.net/";
    }

    async fetchEntitiesWithSearchKey(key: string, isAll: boolean) {
        try {
            const respData = await axios.post(
                `${this._baseUrl}/EntitySearch?v_keyword=${key}${isAll ? "" : "&v_epn_only=1"}`
            );
            return respData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async fetchPOIsWithEntityNumber(entityNumber: string) {
        try {
            const respData = await axios.post(`${this._baseUrl}/TCEQ_EPN_Geojson?entity_number=${entityNumber}`);
            return respData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}

export default APIInterface;
