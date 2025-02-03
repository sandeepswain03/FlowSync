import { WebContainer } from '@webcontainer/api';

let webContainerInstance: WebContainer | null = null;

const getWebContainer = async (): Promise<WebContainer> => {
    if (webContainerInstance === null) {
        webContainerInstance = await WebContainer.boot();
    }
    return webContainerInstance;
}
export { getWebContainer };