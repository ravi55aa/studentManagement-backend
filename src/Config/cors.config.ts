import cors from "cors";

cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
});

export default cors;