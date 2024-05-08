import { DataStats } from "./DataStats";

export interface DashboardStats {

    statsData: DataStats[],
    topTags: DataStats[],
    topAuthors: DataStats[],
    topViews: DataStats[];

}