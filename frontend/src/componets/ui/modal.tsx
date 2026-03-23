"use cliente"

import {
    Modal, ModalContent, ModalHeader,
    ModalBody, ModalFooter, Button
} from "@heroui/react";

interface ModalButton {
    label: string;
    color?: "primary" | "danger" | "warning" | "success" | "default" | "secondary";
    variant?: "flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "ghost";
    onPress: () => void;
}
//types.ts
interface ModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    buttons?: ModalButton[];
    // modo texto
    text?: string;
    // modo formulario
    children?: React.ReactNode;
    scrollBehavior?: "inside" | "outside" | "normal";
}

export const ModalBase = ({
    isOpen,
    onClose,
    title,
    size = "md",
    buttons,
    text,
    children,
    scrollBehavior = "normal",
}: ModalBaseProps) => {
    return (
        <Modal isOpen={isOpen} size={size} onClose={onClose} placement="top-center" scrollBehavior={scrollBehavior}>
            <ModalContent>
                {(onCloseInternal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {title}
                        </ModalHeader>

                        <ModalBody>
                            {/* modo texto */}
                            {text && <p className="text-default-600">{text}</p>}

                            {/* modo formulario o aviso con contenido custom */}
                            {children}
                        </ModalBody>

                        {buttons && buttons.length > 0 && (
                            <ModalFooter>
                                {buttons.map((btn, i) => (
                                    <Button
                                        key={i}
                                        color={btn.color ?? "primary"}
                                        variant={btn.variant ?? "solid"}
                                        onPress={btn.onPress}
                                    >
                                        {btn.label}
                                    </Button>
                                ))}
                            </ModalFooter>
                        )}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};