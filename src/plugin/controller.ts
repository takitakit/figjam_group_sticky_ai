figma.showUI(__html__)
// figma.closePlugin();

// figma.showUI(__html__);

figma.ui.onmessage = msg => {
  console.log(`${msg.type} message received`)

  if (msg.type === 'load-config') {
    // Send config to UI
    figma.clientStorage.getAsync('API_KEY').then(apiKey => {
      figma.ui.postMessage({
        type: 'load-config-done',
        data: { apiKey: apiKey ?? undefined },
      })
    })
  } else if (msg.type === 'save-config') {
    // PluginDataにAPI_KEYを保存
    const config = msg.data
    console.log('config', config)

    figma.clientStorage.setAsync('API_KEY', config.apiKey).then(() => {
      figma.ui.postMessage({ type: 'save-config-done' })
    })
  }
  // if (msg.type === 'create-rectangles') {
  //   const nodes = [];

  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }

  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);

  //   // This is how figma responds back to the ui
  //   figma.ui.postMessage({
  //     type: 'create-rectangles',
  //     message: `Created ${msg.count} Rectangles`,
  //   });

  // figma.closePlugin();
}
