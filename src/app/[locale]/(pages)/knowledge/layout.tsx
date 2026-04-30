import React from "react"

export default function KnowledgeLayout({
    children,
    filters
}: Readonly<{children: React.ReactNode; filters: React.ReactNode}>) {
    return (
        <> 
            {filters}
            {children}
        </> 
    )
}