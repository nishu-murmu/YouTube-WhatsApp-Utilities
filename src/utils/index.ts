import ReactDOM from "react-dom/client";

export const createShadowRootUiWrapper = async ({
  ctx,
  name,
  position,
  anchor,
  component,
}: {
  ctx: any;
  name: string;
  position: "inline" | "overlay" | "modal";
  anchor: string;
  component: React.ReactNode;
}) => {
  return createShadowRootUi(ctx, {
    name,
    position,
    anchor,
    onMount: (container) => {
      const app = document.createElement("div");
      container.append(app);
      const root = ReactDOM.createRoot(app);
      root.render(component);
      return root;
    },
    onRemove: (root) => {
      // Unmount the root when the UI is removed
      root?.unmount();
    },
  });
};
