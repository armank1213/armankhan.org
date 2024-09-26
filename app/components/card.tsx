import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-lg bg-zinc-800 p-4">
			{children}
		</div>
	);
}
