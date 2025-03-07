"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("../config"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const supabase = (0, supabase_js_1.createClient)(config_1.default.SUPABASE_URL, config_1.default.SUPABASE_ANON_KEY);
async function handler(req, res) {
    (0, authMiddleware_1.verifyJwt)(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const { jobId } = req.query;
                let query = supabase.from('log_stats').select('*');
                if (jobId) {
                    query = query.eq('job_id', jobId);
                }
                const { data, error } = await query;
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                return res.status(200).json(data);
            }
            catch (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
        else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
;
