let KEYS_DB = {};

export function saveKey(key, timestamp) {
    KEYS_DB[key] = timestamp;
}

export function isKeyValid(key) {
    const savedTime = KEYS_DB[key];
    if (!savedTime) return false;

    const currentTime = Date.now();
    const diffMs = currentTime - savedTime;
    const diffHours = diffMs / 1000 / 60 / 60;
    return diffHours < 4;
}