import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { ModelData } from "@/views/types/dataType";

interface LoadParam {
  url: string;
}

export class LoaderManager {
  gltfLoader: GLTFLoader;
  queue: {
    loadParam: LoadParam;
    callBackArray: Function[];
  }[];
  currentLoading: number;
  maxLoading: number;
  modelMap: Map<string, ModelData>;

  constructor() {
    this.queue = [];
    this.currentLoading = 0;
    this.maxLoading = 5;
    this.modelMap = new Map();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setWorkerLimit(this.maxLoading);
    dracoLoader.setDecoderPath("/arch-design/draco/");
    dracoLoader.preload();
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }

  dispose() {
    this.queue.splice(0, this.queue.length);
    this.modelMap.clear();
  }

  add(loadParam: LoadParam, callBack: (data: ModelData) => void) {
    const item = this.queue.find((q) => q.loadParam.url === loadParam.url);
    if (item) {
      item.callBackArray.push(callBack);
    } else {
      this.queue.push({
        loadParam,
        callBackArray: [callBack],
      });
    }
  }

  processQueue(complete?: Function) {
    while (this.currentLoading <= this.maxLoading && this.queue.length > 0) {
      const item = this.queue.shift();
      if (this.modelMap.has(item.loadParam.url)) {
        const modelData: ModelData = this.modelMap.get(item.loadParam.url)!;
        item.callBackArray.forEach((callBack) => {
          callBack(modelData);
        });
        if (this.queue.length > 0) {
          setTimeout(() => {
            this.processQueue(complete);
          });
        } else if (this.currentLoading === 0 && complete) {
          setTimeout(() => {
            complete();
          });
        }
      } else {
        this.currentLoading++;
        this.loadModel(item.loadParam.url)
          .then((gltf) => {
            const model = gltf.scene;
            model.rotateX(Math.PI / 2);
            model.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const negateCenter = center.clone().negate();
            model.position.add(negateCenter);
            model.updateMatrixWorld(true);

            box.translate(negateCenter);

            const modelData: ModelData = {
              model,
              originBox: box,
              url: item.loadParam.url,
            };
            this.modelMap.set(item.loadParam.url, modelData);
            item.callBackArray.forEach((callBack) => {
              callBack(modelData);
            });
            this.currentLoading--;
            if (this.queue.length > 0) {
              setTimeout(() => {
                this.processQueue(complete);
              });
            } else if (this.currentLoading === 0 && complete) {
              setTimeout(() => {
                complete();
              });
            }
          })
          .catch((error) => {
            console.error("model loading failed!", error);
            this.currentLoading--;
            if (this.queue.length > 0) {
              setTimeout(() => {
                this.processQueue(complete);
              });
            } else if (this.currentLoading === 0 && complete) {
              setTimeout(() => {
                complete();
              });
            }
          });
      }
    }
  }

  loadModel(url: string) {
    return new Promise<any>((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf);
        },
        null,
        () => {
          setTimeout(() => {
            this.gltfLoader.load(
              url,
              (gltf) => {
                resolve(gltf);
              },
              null,
              (error) => {
                reject(error);
              }
            );
          });
        }
      );
    });
  }
}
