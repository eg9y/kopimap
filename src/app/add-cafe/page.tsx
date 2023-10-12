"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  //   const [address, setAddress] = useState("");
  //   const [address, setAddress] = useState("");
  //   const [address, setAddress] = useState("");

  return (
    <div>
      <h1>Add Cafe</h1>
      <div className="flex gap-1">
        <Label>Name</Label>
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="flex gap-1">
        <Label>Address</Label>
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
