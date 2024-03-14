import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlBackend } from "../global";

interface NavProps {
  userId: string;
}
const Administrator: React.FC <NavProps> = ({ userId }) => {

    return (
        <h1></h1>
    );
};

export default Administrator;
