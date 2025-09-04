import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaPhoneAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AskSakhiiModal from "../ai/AskSakhiiModal";
import LanguageSelector from "@/components/ui/language-selector";

const TopBar: React.FC = () => {
  const [isAskSakhiiOpen, setIsAskSakhiiOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const { t } = useTranslation();

  const emergencyHelplines = [
    {
      name: "National Emergency Helpline",
      number: "112",
      description: "General emergency services - Police, Fire, Medical",
      available: "24/7"
    },
    {
      name: "Women Helpline",
      number: "1091",
      description: "National helpline for women in distress",
      available: "24/7"
    },
    {
      name: "Medical Emergency",
      number: "108",
      description: "Free ambulance and medical emergency services",
      available: "24/7"
    },
    {
      name: "Domestic Violence Helpline",
      number: "181",
      description: "Support for domestic violence victims",
      available: "24/7"
    },
    {
      name: "Mental Health Helpline",
      number: "9152987821",
      description: "iCALL - Psychosocial helpline",
      available: "Mon-Sat 8AM-10PM"
    },
    {
      name: "Poison Control",
      number: "1800-11-4098",
      description: "All India Institute of Medical Sciences poison control",
      available: "24/7"
    }
  ];

  const callHelpline = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

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

        <div className="flex items-center">
          <LanguageSelector variant="navbar" />
        </div>

        <Button
          onClick={() => setIsSOSOpen(true)}
          className="px-6 py-2 rounded-lg bg-[#BC0707] text-white hover:bg-[#A00606] transition w-full sm:w-auto flex items-center gap-2"
        >
          <FaPhoneAlt className="h-4 w-4" />
          {t("navbar.sos", "SOS")}
        </Button>
      </div>

      {/* Modals */}
      <AskSakhiiModal
        isOpen={isAskSakhiiOpen}
        onClose={() => setIsAskSakhiiOpen(false)}
      />
      
      {/* SOS Emergency Modal */}
      <Dialog open={isSOSOpen} onOpenChange={setIsSOSOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <FaPhoneAlt className="h-5 w-5" />
              {t("sos.title", "Emergency Helplines")}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-600">
              {t("sos.description", "In case of emergency, you can call these helpline numbers for immediate assistance:")}
            </p>
            
            {emergencyHelplines.map((helpline, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{helpline.name}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {helpline.available}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{helpline.description}</p>
                <Button
                  onClick={() => callHelpline(helpline.number)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                >
                  <FaPhoneAlt className="h-4 w-4" />
                  Call {helpline.number}
                </Button>
              </div>
            ))}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>{t("sos.note", "Note:")}</strong> {t("sos.noteText", "These services are free and available across India. In life-threatening emergencies, call 112 immediately.")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopBar;
