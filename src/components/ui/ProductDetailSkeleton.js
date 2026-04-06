"use client";
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailSkeleton() {
    return (
        <div className="pdp-skeleton-wrapper">
            {/* Breadcrumb */}
            <Skeleton className="pdp-skeleton-breadcrumb skeleton-pulse" />

            {/* Main grid: image + details */}
            <div className="pdp-skeleton-grid">
                <Skeleton className="pdp-skeleton-image skeleton-pulse" />
                <div className="pdp-skeleton-details">
                    <Skeleton className="pdp-skeleton-title skeleton-pulse" />
                    <Skeleton className="pdp-skeleton-badge skeleton-pulse" />
                    <Skeleton className="pdp-skeleton-id skeleton-pulse" />
                    <Skeleton className="pdp-skeleton-btn skeleton-pulse" />
                </div>
            </div>

            {/* Description block */}
            <Skeleton className="pdp-skeleton-desc-title skeleton-pulse" />
            {[100, 90, 95, 80, 70].map((w, i) => (
                <Skeleton
                    key={i}
                    className="pdp-skeleton-desc-line skeleton-pulse"
                    style={{ width: `${w}%` }}
                />
            ))}
        </div>
    );
}
