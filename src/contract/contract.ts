import registry from "./abi/registry.json";
import hub from "./abi/hub.json";
import game from "./abi/game.json";

const registryAddress = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
const hubAddress = process.env.NEXT_PUBLIC_HUB_ADDRESS;
const gameAddress = process.env.NEXT_PUBLIC_GAME_ADDRESS;

const registryABI = registry.abi;
const hubABI = hub.abi;
const gameABI = game.abi;


export { registryABI, hubABI, registryAddress, hubAddress, gameABI, gameAddress };