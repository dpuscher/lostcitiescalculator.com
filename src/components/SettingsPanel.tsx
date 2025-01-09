import settingsStore from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { Fragment, useState } from "react";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useStore(settingsStore);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const updateSetting =
    (key: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
      settingsStore.set({ ...settingsStore.get(), [key]: e.target.value });
    };

  const updatePlayer1Name = updateSetting("player1Name");
  const updatePlayer2Name = updateSetting("player2Name");

  return (
    <>
      <button
        className="absolute top-1 right-0 p-2 text-xl text-gray-400"
        onClick={toggleOpen}
        type="button"
      >
        {isOpen ? <IoSettings /> : <IoSettingsOutline />}
      </button>

      {isOpen && (
        <div className="mt-1 p-4 border border-gray-200 rounded shadow-lg flex flex-col gap-2">
          <h2 className="text-lg font-bold leading-none mb-2">Settings</h2>
          <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
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
                  className="border border-gray-300 rounded p-1 text-black"
                />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;
