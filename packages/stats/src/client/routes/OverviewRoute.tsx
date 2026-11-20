import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { getOverviewStats, getRecentRequests } from "../api";
import { Legend, ShareBar, TimeChart } from "../charts";
import { OTHER_COLOR } from "../data/colors";
import {
	formatCompact,
	formatDurationMs,
	formatErrorRate,
	formatEstimatedCost,
	formatInteger,
	formatMessageCost,
	formatPercent,
	formatRelativeTime,
	formatTokensPerSecond,
} from "../data/formatters";
import { useQuery } from "../data/query";
import { bucketAxis, rangeMeta } from "../data/range";
import { densify } from "../data/series";
import {
	buildDecisionModelShare,
	buildUsageTokenShare,
	sumConversationTokens,
	type TokenShareSegment,
	type TokenShareView,
} from "../data/view-models";
import { type Locale, type TranslationFn, useTranslation } from "../i18n";
import type { AgentType, MessageStats, TimeRange } from "../types";
import {
	Badge,
	Card,
	ChartSkeleton,
	Dot,
	LabelCell,
	PageHeader,
	QueryView,
	Segmented,
	Stat,
	StatGrid,
	Table,
	TableSkeleton,
} from "../ui";

export interface OverviewRouteProps {
	active: boolean;
	range: TimeRange;
	onRequestClick: (id: number) => void;
}

type ActivityMetric = "requests" | "tokens" | "cost";

const AGENT_COLOR: Record<AgentType, string> = {
	main: "var(--chart-primary)",
	subagent: "var(--chart-secondary)",
	advisor: "#9d7bff",
};

interface AgentLabel {
	agentType: AgentType;
	label: string;
	color: string;
}

/** Agent legend entries, labeled through the dashboard translator. */
function agentLabels(t: TranslationFn): AgentLabel[] {
	return [
		{ agentType: "main", label: t("agent.main"), color: AGENT_COLOR.main },
		{ agentType: "subagent", label: t("agent.subagent"), color: AGENT_COLOR.subagent },
		{ agentType: "advisor", label: t("agent.advisor"), color: AGENT_COLOR.advisor },
	];
}

interface TokenMixEntry {
	key: "input" | "cacheRead" | "cacheWrite" | "output";
	label: string;
	color: string;
}

/** Token-mix legend entries, labeled through the dashboard translator. */
function tokenMix(t: TranslationFn): TokenMixEntry[] {
	return [
		{ key: "input", label: t("common.uncachedInput"), color: "#5b8cff" },
		{ key: "cacheRead", label: t("common.cacheRead"), color: "var(--chart-primary)" },
		{ key: "cacheWrite", label: t("common.cacheWrite"), color: "#f5b54a" },
		{ key: "output", label: t("common.output"), color: "var(--chart-secondary)" },
	];
}

export function OverviewRoute({ active, range, onRequestClick }: OverviewRouteProps) {
	const { t, locale } = useTranslation();
	const overview = useQuery(["overview", range], ({ signal }) => getOverviewStats(range, signal), { enabled: active });
	const recent = useQuery(["recent-requests"], ({ signal }) => getRecentRequests(12, signal), { enabled: active });
	const [metric, setMetric] = useState<ActivityMetric>("requests");
	const meta = rangeMeta(range);
	const activityOptions = useMemo(
		() => [
			{ value: "requests" as const, label: t("common.requests") },
			{ value: "tokens" as const, label: t("common.tokens") },
			{ value: "cost" as const, label: t("common.cost") },
		],
		[t],
	);

	const series = useMemo(() => {
		const points = overview.data?.timeSeries ?? [];
		const buckets = bucketAxis(
			range,
			points.map(p => p.timestamp),
		);
		return {
			buckets,
			requests: densify(points, buckets, p => p.requests - p.errors),
			errors: densify(points, buckets, p => p.errors),
			tokens: densify(points, buckets, p => p.tokens),
			cost: densify(points, buckets, p => p.cost),
			all: densify(points, buckets, p => p.requests),
		};
	}, [overview.data, range]);

	const attribution = useMemo(() => {
		const data = overview.data;
		if (!data) return null;
		return {
			usage: buildUsageTokenShare(data.byAgentType, data.bySideChannel),
			decisions: buildDecisionModelShare(data.bySideChannel),
		};
	}, [overview.data]);

	const chartSeries =
		metric === "requests"
			? [
					{ key: "ok", label: t("common.success"), color: "var(--chart-primary)", values: series.requests },
					{ key: "err", label: t("common.failed"), color: "var(--bad)", values: series.errors },
				]
			: metric === "tokens"
				? [{ key: "tokens", label: t("common.tokens"), color: "var(--chart-primary)", values: series.tokens }]
				: [{ key: "cost", label: t("costs.apiEquivalent"), color: "var(--chart-secondary)", values: series.cost }];

	return (
		<div className="page">
			<PageHeader
				title={t("nav.section.overview")}
				description={t("overview.pageDescription", { window: meta.windowLabel })}
			/>

			<QueryView query={overview} skeleton={<ChartSkeleton height={112} />}>
				{({ overall }) => (
					<div data-stale={overview.stale} className="stack" style={{ gap: 16 }}>
						<StatGrid min={190}>
							<Stat
								label={t("costs.apiEquivalent")}
								title={t("common.costTooltip")}
								value={formatEstimatedCost(overall.totalCost, overall.unpricedRequests)}
								hint={
									overall.unpricedRequests > 0
										? t("common.unpricedCount", {
												count: formatInteger(overall.unpricedRequests),
											})
										: undefined
								}
								spark={series.cost}
								sparkColor="var(--chart-secondary)"
							/>
							<Stat
								label={t("common.requests")}
								value={formatInteger(overall.totalRequests)}
								hint={t("common.failedCount", { count: formatInteger(overall.failedRequests) })}
								spark={series.all}
							/>
							<Stat
								label={t("common.conversationTotal")}
								title={t("common.tokenMixTooltip")}
								value={formatCompact(sumConversationTokens(overall), locale)}
								hint={t("common.hint.output", {
									count: formatCompact(overall.totalOutputTokens, locale),
								})}
								spark={series.tokens}
							/>
							<Stat
								label={t("common.cacheRate")}
								title={t("common.cacheRateTooltip")}
								value={formatPercent(overall.cacheRate)}
								hint={t("common.hint.saved", { share: formatPercent(overall.cacheSavings) })}
							/>
							<Stat
								label={t("metric.errorRate")}
								value={formatErrorRate(overall.errorRate)}
								hint={t("common.succeededCount", {
									count: formatInteger(overall.successfulRequests),
								})}
								spark={series.errors}
								sparkColor="var(--bad)"
							/>
						</StatGrid>
						<StatGrid min={140}>
							<Stat
								size="sm"
								label={t("common.uncachedInput")}
								value={formatCompact(overall.totalInputTokens, locale)}
							/>
							<Stat
								size="sm"
								label={t("common.cacheRead")}
								value={formatCompact(overall.totalCacheReadTokens, locale)}
							/>
							<Stat
								size="sm"
								label={t("common.cacheWrite")}
								value={formatCompact(overall.totalCacheWriteTokens, locale)}
							/>
							<Stat
								size="sm"
								label={t("common.output")}
								value={formatCompact(overall.totalOutputTokens, locale)}
							/>
							<Stat
								size="sm"
								label={t("metric.premiumRequests")}
								value={formatInteger(Math.round(overall.totalPremiumRequests * 100) / 100)}
							/>
							<Stat
								size="sm"
								label={t("common.tokensPerSec")}
								value={formatTokensPerSecond(overall.avgTokensPerSecond)}
							/>
							<Stat size="sm" label={t("metric.avgLatency")} value={formatDurationMs(overall.avgDuration)} />
							<Stat size="sm" label={t("metric.avgTTFT")} value={formatDurationMs(overall.avgTtft)} />
						</StatGrid>
					</div>
				)}
			</QueryView>

			<div className="grid grid-main-side">
				<Card
					index={1}
					title={t("overview.activity")}
					description={t("overview.perBucket", {
						bucket: t(
							meta.bucketMs < 3_600_000
								? "common.bucket.5minutes"
								: meta.bucketMs < 86_400_000
									? "common.bucket.hour"
									: "common.bucket.day",
						),
					})}
					actions={<Segmented size="sm" options={activityOptions} value={metric} onChange={setMetric} />}
					stale={overview.stale}
				>
					<QueryView query={overview} skeleton={<ChartSkeleton height={260} />}>
						{() => (
							<TimeChart
								buckets={series.buckets}
								bucketMs={meta.bucketMs}
								series={chartSeries}
								height={260}
								format={metric === "cost" ? v => formatEstimatedCost(v, 0) : v => formatCompact(v, locale)}
							/>
						)}
					</QueryView>
				</Card>

				<Card
					index={2}
					title={t("overview.tokenMix")}
					description={t("overview.tokenMixDescription")}
					stale={overview.stale}
				>
					<QueryView query={overview} skeleton={<ChartSkeleton height={260} />}>
						{({ overall }) => {
							const mix = {
								input: overall.totalInputTokens,
								cacheRead: overall.totalCacheReadTokens,
								cacheWrite: overall.totalCacheWriteTokens,
								output: overall.totalOutputTokens,
							};
							const total = sumConversationTokens(overall);
							return (
								<div className="stack" style={{ gap: 18 }}>
									<div className="stack" style={{ gap: 10 }}>
										<ShareBar
											segments={tokenMix(t).map(m => ({
												key: m.key,
												label: m.label,
												value: mix[m.key],
												color: m.color,
											}))}
										/>
										<Legend
											items={tokenMix(t).map(m => ({
												key: m.key,
												label: m.label,
												color: m.color,
												value: total > 0 ? formatPercent(mix[m.key] / total, 0) : "–",
											}))}
										/>
									</div>
									{attribution && (
										<div className="stack" style={{ gap: 10 }}>
											<div className="section-label" style={{ marginBottom: 0 }}>
												{t("overview.bySource")}
											</div>
											<ShareBreakdown view={attribution.usage} />
										</div>
									)}
								</div>
							);
						}}
					</QueryView>
				</Card>
			</div>

			{attribution && attribution.decisions.segments.length > 0 && (
				<Card
					index={3}
					title="Decision models"
					description="Where decision-model tokens went, by use case"
					stale={overview.stale}
				>
					<ShareBreakdown view={attribution.decisions} wide />
				</Card>
			)}

			<Card
				index={4}
				title={
					<>
						<Dot tone="live" pulse /> {t("overview.latestRequests")}
					</>
				}
				description={t("overview.preview.subtitle")}
				actions={
					<a className="btn" data-size="sm" data-variant="ghost" href={`#/requests?range=${range}`}>
						{t("overview.viewAll")} <ArrowRight size={13} />
					</a>
				}
				flush
			>
				<QueryView query={recent} skeleton={<TableSkeleton rows={8} />}>
					{rows => (
						<Table
							rows={rows}
							rowKey={row => row.id ?? `${row.sessionFile}:${row.entryId}`}
							onRowClick={row => row.id !== undefined && onRequestClick(row.id)}
							columns={requestColumns(t, locale)}
							dense
						/>
					)}
				</QueryView>
			</Card>
		</div>
	);
}

function segmentLabel(segment: TokenShareSegment, t: TranslationFn): string {
	if (segment.kind === "agent") {
		return agentLabels(t).find(a => a.agentType === segment.agentType)?.label ?? segment.agentType;
	}
	return segment.category.charAt(0).toUpperCase() + segment.category.slice(1);
}

function segmentColor(segment: TokenShareSegment, colors: ReadonlyMap<string, string>): string {
	if (segment.kind === "agent") return AGENT_COLOR[segment.agentType];
	return colors.get(segment.category) ?? OTHER_COLOR;
}

/**
 * A share bar over one row per segment: swatch, label, requests, tokens, percent of the bar.
 * `wide` lays the rows out in columns, for a card that spans the page.
 */
function ShareBreakdown({ view, wide = false }: { view: TokenShareView; wide?: boolean }) {
	const { t } = useTranslation();
	const { segments, categoryColors } = view;
	return (
		<div className="stack" style={{ gap: 10 }}>
			<ShareBar
				segments={segments.map(s => ({
					key: s.key,
					label: segmentLabel(s, t),
					value: s.tokens,
					color: segmentColor(s, categoryColors),
				}))}
			/>
			<div className={wide ? "grid grid-3" : "stack"} style={{ gap: wide ? "10px 28px" : 10 }}>
				{segments.map(s => (
					<div key={s.key} className="row" style={{ justifyContent: "space-between" }}>
						<span className="row" style={{ minWidth: 0 }}>
							<span className="swatch" style={{ background: segmentColor(s, categoryColors) }} />
							<span className="truncate">{segmentLabel(s, t)}</span>
							<span className="dim num" style={{ flexShrink: 0 }}>
								{t("common.hint.req", { count: formatInteger(s.requests) })}
							</span>
						</span>
						<span className="row" style={{ flexShrink: 0 }}>
							<span className="dim num">{formatCompact(s.tokens)}</span>
							<span className="num" style={{ minWidth: 48, textAlign: "right" }}>
								{formatPercent(s.share)}
							</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// Upstream hoists these to module scope; they take the translator so the
// localized headers reach the table without changing its sort contract.
function requestColumns(t: TranslationFn, locale: Locale) {
	return [
		{
			key: "model",
			header: t("common.model"),
			render: (row: MessageStats) => <LabelCell primary={row.model} secondary={row.provider} />,
		},
		{
			key: "time",
			header: t("common.when"),
			render: (row: MessageStats) => <span className="muted">{formatRelativeTime(row.timestamp, locale)}</span>,
		},
		{
			key: "tokens",
			header: t("common.tokens"),
			align: "right" as const,
			render: (row: MessageStats) => <span className="num">{formatInteger(row.usage.totalTokens)}</span>,
		},
		{
			key: "cost",
			header: t("common.cost"),
			align: "right" as const,
			render: (row: MessageStats) => <span className="num">{formatMessageCost(row, 4)}</span>,
		},
		{
			key: "duration",
			header: t("common.duration"),
			align: "right" as const,
			render: (row: MessageStats) => <span className="num">{formatDurationMs(row.duration)}</span>,
		},
		{
			key: "status",
			header: t("common.status"),
			align: "right" as const,
			render: (row: MessageStats) =>
				row.errorMessage ? (
					<Badge tone="bad">{t("common.failed")}</Badge>
				) : (
					<Badge tone="ok">{t("common.success")}</Badge>
				),
		},
	];
}
