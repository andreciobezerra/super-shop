import { Injectable } from "@nestjs/common";
import cluster from "cluster";
import * as os from "os";

const CPUS = os.cpus();

@Injectable()
export class AppClusterService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static clusterize(callback: Function) {
    if (cluster.isPrimary) {
      console.info(`Master server started on ${process.pid}.`);
      CPUS.forEach(() => cluster.fork());
      cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });
    } else {
      console.info(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}

export default AppClusterService;
