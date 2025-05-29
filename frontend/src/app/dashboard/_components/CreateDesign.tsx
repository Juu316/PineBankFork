import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/addedAxiosInstance";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Designs } from "@/app/types";

interface CreateDesignProps {
  setDesigns: React.Dispatch<React.SetStateAction<Designs[]>>;
}

export const CreateDesign = ({ setDesigns }: CreateDesignProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [design, setDesign] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getToken } = useAuth();

  const createDesign = async () => {
    const token = await getToken();
    if (!toAccountNumber) {
      setError("Хүлээн авагчийн данс хоосон байна.");
      return;
    }
    if (!design) {
      setError("Загварын нэр хоосон байна.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const saveDesign = {
        toAccountNumber,
        designName: design,
      };
      const res = await axiosInstance.post("/design", saveDesign, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        // Refresh designs list
        const currentUserData = JSON.parse(
          localStorage.getItem("currentUserData") || "{}"
        );
        const updatedDesigns = [...(currentUserData.designs || []), res.data];
        setDesigns(updatedDesigns);
        setIsDialogOpen(false);
        setToAccountNumber("");
        setDesign("");
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-full cursor-pointer rounded-2xl border flex flex-col items-center justify-center dark:bg-[#343434] bg-[rgb(243,243,243)] dark:hover:bg-blue-950 hover:bg-[#85bb65] hover:text-white transition duration-400 ease-in-out">
          <div className="text-orange-400 text-2xl">+</div>
          <div className="text-blue-950 dark:text-white">
            <div className="text-sm">Загвар</div>
            <div className="text-sm">нэмэх</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Загвар үүсгэх</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="design" className="text-right">
              Загварын нэр
            </Label>
            <Input
              id="design"
              value={design}
              onChange={(e) => setDesign(e.target.value)}
              className="col-span-3"
              maxLength={13}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="account" className="text-right">
              Дансны дугаар
            </Label>
            <Input
              id="account"
              value={toAccountNumber}
              onChange={(e) => setToAccountNumber(e.target.value)}
              className="col-span-3"
              maxLength={10}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" onClick={createDesign} disabled={loading}>
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
