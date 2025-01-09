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
