function createController(model, view) {
    model.onChange((event, state) => {
      switch (event) {
        case "start":
          view.clearSectors();
          view.lockBoard(false);
          view.renderLevel(state.level);
          view.renderBtn(true, "Игра идёт...");
          break;
        case "sequence-start":
          view.lockBoard(true);
          view.renderStatus("Запоминайте...");
          break;
        case "sequence-end":
          view.lockBoard(false);
          view.renderStatus("Ваш ход");
          break;
        case "correct":
          view.lockBoard(true);
          view.renderStatus("Верно! Следующий уровень...");
          break;
        case "gameover":
          view.lockBoard(true);
          view.renderStatus(`Вы дошли до уровня ${state.level}`);
          view.renderBtn(false, "Старт");
          break;
      }
      view.renderLevel(state.level);
    });
  
    model.onHighlight((index, on) => view.highlight(index, on));
  
    return {
      init: () => {
        view.bind(
          () => model.startGame(),            
          (index) => model.handleInput(index) 
        );
        view.lockBoard(true);
        view.renderStatus("Нажмите «Старт»");
        view.renderLevel(model.state.level);
      }
    };
  }