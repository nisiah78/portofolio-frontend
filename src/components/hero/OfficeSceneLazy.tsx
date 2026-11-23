"use client";

import dynamic from "next/dynamic";

/** three.js stays out of the server render and the initial bundle. */
export const OfficeSceneLazy = dynamic(() => import("./OfficeScene"), { ssr: false });
