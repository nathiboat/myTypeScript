const getShortcuts = async shortcutsApiUrl => {
  const shortcutsResponse = await fetch(shortcutsApiUrl);
  const shortcuts = await shortcutsResponse.json();
  return shortcuts;
};

const listenForInputValue = shortcutsApiUrl => {
  getShortcuts(shortcutsApiUrl)
    .then(shortcuts => {
      window.removeEventListener("keyup", () =>
        handleInputValue(event, shortcuts)
      );
      window.addEventListener("keyup", () =>
        handleInputValue(event, shortcuts)
      );
    })
    .catch(error => console.error(error));
};

const handleInputValue = (event, shortcuts) => {
  if (event.target.value) {
    let value = event.target.value || "";
    let valueUpToCursor = value.substring(0, event.target.selectionEnd);

    const findShortcutInInput = (shortcuts, value) => {
      return shortcuts.filter(shortcut =>
        value.endsWith(shortcut.keys)
      )[0];
    };

    if (Array.isArray(shortcuts) && shortcuts.length) {
      if(findShortcutInInput(shortcuts, valueUpToCursor)) {
        let shortcut = findShortcutInInput(shortcuts, valueUpToCursor);
        updateInputValue(event, shortcut);
      }
    }
  }
};

const updateInputValue = (event, shortcut) => {
  let value = event.target.value;
  let valueBeforeShortcut = value.split(shortcut.keys)[0];
  let newCursorPosition =
    valueBeforeShortcut.length + shortcut.name.length;
  event.target.value = value.replace(
    shortcut.keys,
    shortcut.name
  );
  event.target.setSelectionRange(newCursorPosition, newCursorPosition);
};

const listenForModalTrigger = () => {
  let pressedKeys = [];
  let modalTriggerKeys = [" ", "Meta", "Shift"];

  const areArraysEqual = (array1, array2) => {
    return (
      array1.length === array2.length &&
      array1.sort().every((value, index) => value === array2.sort()[index])
    );
  };

  const logPressedKeys = event => {
    if (event.repeat) return;
    pressedKeys.push(event.key);
    if (areArraysEqual(pressedKeys, modalTriggerKeys) && event.target.value) {
      sendMessageToModal(event);
    }
  };

  const clearPressedKeys = () => {
    pressedKeys = [];
  };

  window.removeEventListener("keydown", logPressedKeys);
  window.addEventListener("keydown", logPressedKeys);

  window.removeEventListener("keyup", clearPressedKeys);
  window.addEventListener("keyup", clearPressedKeys);
};

export const shortcutLogic = {
  listenForInputValue,
  updateInputValue,
  listenForModalTrigger
};