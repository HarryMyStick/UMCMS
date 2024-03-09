import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Header from "./header";

interface NavProps {
  userId: string;
}
const MarketingManager: React.FC <NavProps> = ({ userId }) => {
    return (
        <h1></h1>
    );
};

export default MarketingManager;