export interface Subscription {
    id: number;
    activeUntil: string;
    level: SubscriptionLevel;
}

export interface SubscriptionLevel {
    key: string;
    name: string;
    description: string;
    features: SubscriptionFeature[];
}

export interface SubscriptionFeature {
    key: string;
    name: string;
    description: string;
}

export const SubscriptionKey = {
    MAX_QUEUE_COUNT: "max.queue.count.",
    MAX_INJECTION_COUNT: "max.injection.count.",
    MAX_FILE_SIZE: "max.file.size.",
} as const;
