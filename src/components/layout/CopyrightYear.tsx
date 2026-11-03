"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => String(new Date().getFullYear());
const getServerSnapshot = () => "";

export default function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return <>{year}</>;
}
