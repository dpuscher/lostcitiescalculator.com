import settingsStore from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { Fragment, useState } from "react";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useStore(settingsStore);

  type SettingsKey = keyof typeof settings;

  const toggleOpen = () => setIsOpen(prev => !prev);

  const updateSetting = (key: SettingsKey, value: string) => {
    settingsStore.set({ ...settingsStore.get(), [key]: value });
  };

  const updateInputSetting = (key: SettingsKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSetting(key, e.target.value);
  };

  const updateCheckboxSetting = (key: SettingsKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSetting(key, e.target.checked ? "true" : "false");
  };

  const updatePlayer1Name = updateInputSetting("player1Name");
  const updatePlayer2Name = updateInputSetting("player2Name");
  const updateEnableLongGame = updateCheckboxSetting("enableLongGame");

  return (
    <>
      <button
        className="absolute top-1 right-0 p-2 text-gray-400 text-xl"
        onClick={toggleOpen}
        type="button"
      >
        {isOpen ? <IoSettings /> : <IoSettingsOutline />}
      </button>

      {isOpen && (
        <div className="mt-1 flex flex-col gap-2 rounded border border-gray-200 p-4 shadow-lg">
          <h2 className="mb-2 font-bold text-lg leading-none">Settings</h2>
          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            {(
              [
                ["Player 1", "player1Name", updatePlayer1Name],
                ["Player 2", "player2Name", updatePlayer2Name],
              ] as const
            ).map(([label, key, update]) => (
              <Fragment key={key}>
                <label htmlFor={key} className="font-semibold">
                  {label}:
                </label>
                <input
                  id={key}
                  type="text"
                  value={settings[key]}
                  onChange={update}
                  className="rounded border border-gray-300 p-1 text-black"
                  placeholder="Enter name"
                />
              </Fragment>
            ))}
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <div className="relative inline-flex">
              <input
                id="enableLongGame"
                type="checkbox"
                checked={settings.enableLongGame === "true"}
                onChange={updateEnableLongGame}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-amber-600 checked:bg-amber-600"
              />
              <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 transform text-white opacity-0 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
            Enable long game (6 expeditions)
          </label>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;
