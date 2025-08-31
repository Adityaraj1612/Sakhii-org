import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AskSakhiiModal from "../ai/AskSakhiiModal";
import LanguageSelector from "@/components/ui/language-selector";

const TopBar: React.FC = () => {
  const [isAskSakhiiOpen, setIsAskSakhiiOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="w-full bg-[#CA3561] shadow-md px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 max-w-screen-2xl mx-auto">
      
      {/* Search Bar */}
      <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-full sm:max-w-lg">
        <input
          type="text"
          placeholder="Search..."
          className="outline-none flex-1 text-sm bg-[#CA3561] text-white placeholder-white"
        />
        <FaSearch className="text-white" />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 sm:gap-6">
        <Button
          onClick={() => setIsAskSakhiiOpen(true)}
          variant="secondary"
          className="px-6 py-2 rounded-lg bg-[#BC0707] text-white w-full sm:w-auto"
        >
          {t("navbar.askSakhii", "Ask Sakhii")}
        </Button>

        <button className="px-6  rounded-lg text-white border border-white transition flex items-center gap-2 w-full sm:w-auto justify-center">
          English
          <LanguageSelector variant="navbar" />
        </button>

        <button className="px-6 py-2 rounded-lg bg-[#BC0707] text-white transition w-full sm:w-auto">
          SoS
        </button>
      </div>

      {/* Modal */}
      <AskSakhiiModal
        isOpen={isAskSakhiiOpen}
        onClose={() => setIsAskSakhiiOpen(false)}
      />
    </div>
  );
};

export default TopBar;
