import registry from "./abi/registry.json";
import hub from "./abi/hub.json";

const registryAddress = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
const hubAddress = process.env.NEXT_PUBLIC_HUB_ADDRESS;

const registryABI = registry.abi;
const hubABI = hub.abi;


export { registryABI, hubABI, registryAddress, hubAddress };