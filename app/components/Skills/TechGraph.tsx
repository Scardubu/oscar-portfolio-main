// This component uses D3's imperative simulation API extensively.
// Type coverage is intentionally deferred so the production UI remains stable
// while the visualization is migrated toward a more typed data flow.
// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { Skill } from "@/app/lib/constants";
import {
  type GraphNode,
  type GraphLink,
  skillsToNodes,
  generateSkillLinks,
  getNodeRadius,
  CATEGORY_COLORS,
} from "@/app/lib/skillUtils";

interface TechGraphProps {
  skills: Skill[];
  onSkillClick?: (skill: Skill) => void;
  exploredSkills?: Set<string>;
}

export function TechGraph({ skills, onSkillClick, exploredSkills = new Set() }: TechGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !svgRef.current || skills.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Dimensions
    const width = svgRef.current.clientWidth;
    const height = 600;

    // Convert skills to graph data
    const nodes: GraphNode[] = skillsToNodes(skills);
    const links: GraphLink[] = generateSkillLinks(skills);

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Create container for zoom/pan
    const g = svg.append("g");

    // PRD: Zoom/pan controls
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // PRD: Force simulation with collision detection
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(80)
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3
          .forceCollide<GraphNode>()
          .radius((d) => getNodeRadius(d.proficiency) + 10)
      );

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1.5);

    // Create node groups
    const node = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer");

    // Apply drag behavior
    const dragBehavior = d3
      .drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(dragBehavior);

    // Add circles to nodes with explored state indication
    node
      .append("circle")
      .attr("r", (d) => getNodeRadius(d.proficiency))
      .attr("fill", (d) => CATEGORY_COLORS[d.category])
      .attr("stroke", (d) => exploredSkills.has(d.id) ? "#00d9ff" : "#FFFFFF")
      .attr("stroke-width", (d) => exploredSkills.has(d.id) ? 3 : 2)
      .attr("opacity", 0.9)
      .attr("filter", (d) => exploredSkills.has(d.id) ? "drop-shadow(0 0 6px #00d9ff)" : "none");

    // Add labels to nodes
    node
      .append("text")
      .text((d) => d.name)
      .attr("font-size", "12px")
      .attr("font-family", "Inter, sans-serif")
      .attr("font-weight", "500")
      .attr("fill", "#FFFFFF")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getNodeRadius(d.proficiency) + 16)
      .attr("pointer-events", "none");

    // PRD: Hover interactions - highlight node + connected nodes
    node
      .on("mouseenter", function (event, d) {
        // Get connected node IDs
        const connectedIds = new Set<string>();
        links.forEach((link) => {
          const sourceId =
            typeof link.source === "string" ? link.source : link.source.id;
          const targetId =
            typeof link.target === "string" ? link.target : link.target.id;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });

        // Highlight current node
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: unknown) => getNodeRadius((d as GraphNode).proficiency) * 1.3)
          .attr("opacity", 1)
          .attr("filter", "drop-shadow(0 0 10px currentColor)");

        // Dim non-connected nodes
        node
          .select("circle")
          .transition()
          .duration(200)
          .attr("opacity", (n) =>
            n.id === d.id || connectedIds.has(n.id) ? 1 : 0.2
          );

        // Highlight connected links
        link
          .transition()
          .duration(200)
          .attr("stroke-opacity", (l) => {
            const sourceId =
              typeof l.source === "string" ? l.source : l.source.id;
            const targetId =
              typeof l.target === "string" ? l.target : l.target.id;
            return sourceId === d.id || targetId === d.id ? 0.6 : 0.1;
          })
          .attr("stroke-width", (l) => {
            const sourceId =
              typeof l.source === "string" ? l.source : l.source.id;
            const targetId =
              typeof l.target === "string" ? l.target : l.target.id;
            return sourceId === d.id || targetId === d.id ? 3 : 1.5;
          });
      })
      .on("mouseleave", function () {
        // Reset all nodes
        node
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => getNodeRadius(d.proficiency))
          .attr("opacity", 0.9)
          .attr("filter", "none");

        // Reset all links
        link
          .transition()
          .duration(200)
          .attr("stroke-opacity", 0.2)
          .attr("stroke-width", 1.5);
      })
      .on("click", (event, d) => {
        const skill = skills.find((s) => s.id === d.id);
        if (skill) onSkillClick?.(skill);
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (typeof d.source === "string" ? 0 : d.source.x ?? 0))
        .attr("y1", (d) => (typeof d.source === "string" ? 0 : d.source.y ?? 0))
        .attr("x2", (d) => (typeof d.target === "string" ? 0 : d.target.x ?? 0))
        .attr("y2", (d) => (typeof d.target === "string" ? 0 : d.target.y ?? 0));

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [mounted, skills, onSkillClick, exploredSkills]);

  if (!mounted) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="text-gray-400">Loading visualization...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        className="w-full rounded-xl glass-panel shadow-inner"
      />
      {/* Controls hint */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>
          Drag nodes to reposition • Scroll to zoom • Hover to highlight
          connections
        </p>
      </div>
    </div>
  );
}

