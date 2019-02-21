import React, { Component } from "react";
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";
import Hammer from "react-hammerjs";
import FinalRender from "../components/FinalRender";
import Sticker1 from "../images/stickers/1.png";
import Sticker2 from "../images/stickers/2.png";
import Sticker3 from "../images/stickers/3.png";
import Sticker4 from "../images/stickers/4.png";
import Sticker5 from "../images/stickers/5.png";
import Sticker6 from "../images/stickers/6.png";
import Sticker7 from "../images/stickers/7.png";
import Sticker8 from "../images/stickers/8.png";
import Sticker9 from "../images/stickers/9.png";
import Sticker10 from "../images/stickers/10.png";
import Sticker11 from "../images/stickers/11.png";
import Sticker12 from "../images/stickers/12.png";
import Sticker13 from "../images/stickers/13.png";
import Sticker14 from "../images/stickers/14.png";
import Sticker15 from "../images/stickers/15.png";
import Sticker16 from "../images/stickers/16.png";
import Sticker17 from "../images/stickers/17.png";
import Sticker18 from "../images/stickers/18.png";

class Stories extends Component {
  constructor(props) {
    super(props);
    this.customElements = [];
    this.drawingElements = [];
    this.stickerElements = [];
    this.textElements = [];
    this.textColor = [];
    this.hammerOptions = {
      recognizers: {
        pinch: { enable: true },
        rotate: { enable: true }
      }
    };
    this.state = {
      imageUrl: "",
      displayCustomiser: false,
      textCustomiser: false,
      brushCustomiser: false,
      stickerCustomiser: false,
      brushCustomiserOptions: true,
      stickerOverlayTop: 110,
      selectedBrushColor: "#ffffff",
      selectedBrushSize: 6,
      selectedTextColor: "#ffffff",
      imageContent: null,
      displayTrash: false,
      trashHovered: false,
      customElementCount: 0,
      currentDragIndex: 0,
      displayNotification: false,
      last_rotation: 0,
      start_rotation: 0,
      rotation: 0,
      showRenderPortal: false,
      renderData: null
    };
  }

  componentDidMount = () => {
    document.addEventListener('touchmove',
        function(e) {
            e.preventDefault();
        }, {passive:false});
  };

  isOverTrash = (x, y) => {
    var trashGrid = this.refs.trashBox.getBoundingClientRect();

    var minVertical = trashGrid.top;
    var maxVertical = trashGrid.bottom;
    var minHorizontal = trashGrid.left;
    var maxHorizontal = trashGrid.right;

    if (
      x >= minHorizontal &&
      x <= maxHorizontal &&
      y >= minVertical &&
      y <= maxVertical
    ) {
      return true;
    } else {
      return false;
    }
  };

  launchImagePicker = () => {
    this.refs.fileUploader.click();
  };

  discardImage = () => {
    this.customElements = [];
    this.drawingElements = [];
    this.setState({
      imageUrl: ""
    });
  };

  routeChange = event => {
    const file = this.refs.fileUploader.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imageUrl: reader.result
      });
    };
    if (file) {
      reader.readAsDataURL(file);
      this.setState({
        imageUrl: reader.result
      });
    } else {
      this.setState({
        imageUrl: ""
      });
    }
  };

  toggleStickerCustomiser = () => {
    this.setState({
      stickerCustomiser: true,
      displayCustomiser: true,
      stickerOverlayTop: 50
    });
  };

  toggleBrushCustomiser = () => {
    if (this.state.brushCustomiser) {
      this.setState({
        selectedBrushColor: "#ffffff",
        selectedBrushSize: 6
      });
    }

    this.setState({
      brushCustomiser: !this.state.brushCustomiser,
      displayCustomiser: !this.state.displayCustomiser
    });

    if (this.state.brushCustomiser) {
      var drawing = this.refs.canvasPage.getSaveData();
      this.drawingElements.push(
        <CanvasDraw
          canvasHeight="100%"
          canvasWidth="100%"
          hideGrid={true}
          brushColor="rgba(0,0,0,0)"
          catenaryColor="rgba(0,0,0,0)"
          immediateLoading={true}
          saveData={drawing}
          disabled={true}
        />
      );
      this.refs.canvasPage.clear();
    }
  };

  toggleTextCustomiser = () => {
    if (!this.state.textCustomiser) {
      this.refs.textInput.focus();
    } else {
      if (this.refs.textInput.value !== "") {
        var elementIndex = this.state.customElementCount;

        this.textElements[elementIndex] = this.refs.textInput.value;
        this.textColor[elementIndex] = this.state.selectedTextColor;
        this.customElements[elementIndex] = (
          <Draggable
            onStart={() => this.handleDragStart(elementIndex)}
            onDrag={this.handleDragMove}
            onStop={this.handleDragEnd}
          >
            <Hammer
              options={this.hammerOptions}
              onRotateStart={e => this.handleHammerForText(e, elementIndex)}
              onRotateEnd={e => this.handleHammerForText(e, elementIndex)}
              onRotateMove={e => this.handleHammerForText(e, elementIndex)}
            >
              <div>
                <div id={"text" + elementIndex} className="custom-text-item">
                  <div style={{ color: this.state.selectedTextColor }}>
                    {this.refs.textInput.value}
                  </div>
                </div>
              </div>
            </Hammer>
          </Draggable>
        );

        this.setState({
          customElementCount: this.state.customElementCount + 1
        });
      }
      this.refs.textInput.value = "";
    }

    this.setState({
      textCustomiser: !this.state.textCustomiser,
      displayCustomiser: !this.state.displayCustomiser
    });
  };

  setTextColor = color => {
    this.setState({
      selectedTextColor: color
    });
  };

  setBrushColor = color => {
    this.setState({
      selectedBrushColor: color
    });
  };

  setBrushSize = size => {
    this.setState({
      selectedBrushSize: size
    });
  };

  undoBrushStroke = () => {
    this.refs.canvasPage.undo();
  };

  hideBrushCustomiserOptions = () => {
    this.setState({
      brushCustomiserOptions: false
    });
  };

  showBrushCustomiserOptions = () => {
    this.setState({
      brushCustomiserOptions: true
    });
  };

  expandStickersOverlay = () => {
    var computedTop = this.state.stickerOverlayTop;

    if (this.state.stickerOverlayTop === 50) {
      computedTop = 1;
    } else if (this.state.stickerOverlayTop === 1) {
      computedTop = 50;
    }

    this.setState({
      stickerOverlayTop: computedTop
    });
  };

  closeStickerOverlay = () => {
    this.setState({
      stickerCustomiser: false,
      displayCustomiser: false,
      stickerOverlayTop: 110
    });
  };

  handleHammerForSticker = (e, elementIndex) => {
    switch (e.type) {
      case "rotatestart":
        this.setState({
          last_rotation: this.state.rotation,
          start_rotation: e.rotation
        });
        break;

      case "rotateend":
        this.setState({
          last_rotation: this.state.rotation
        });
        break;

      case "rotatemove":
        var diff = this.state.start_rotation - e.rotation;
        this.setState({
          rotation: this.state.last_rotation - diff
        });
        break;

      default:
        break;
    }

    ReactDOM.render(
      <img
        src={this.stickerElements[elementIndex]}
        alt="sticker"
        style={{
          transform:
            "rotate(" + this.state.rotation + "deg) scale(" + e.scale + ")"
        }}
      />,
      document.getElementById("stickerImage" + elementIndex)
    );
  };

  handleHammerForText = (e, elementIndex) => {
    switch (e.type) {
      case "rotatestart":
        this.setState({
          last_rotation: this.state.rotation,
          start_rotation: e.rotation
        });
        break;

      case "rotateend":
        this.setState({
          last_rotation: this.state.rotation
        });
        break;

      case "rotatemove":
        var diff = this.state.start_rotation - e.rotation;
        this.setState({
          rotation: this.state.last_rotation - diff
        });
        break;

      default:
        break;
    }

    ReactDOM.render(
      <div
        style={{
          color: this.textColor[elementIndex],
          transform:
            "rotate(" + this.state.rotation + "deg) scale(" + e.scale + ")"
        }}
      >
        {this.textElements[elementIndex]}
      </div>,
      document.getElementById("text" + elementIndex)
    );
  };

  addStickerToCanvas = sticker => {
    var elementIndex = this.state.customElementCount;

    this.stickerElements[elementIndex] = sticker;
    this.customElements[elementIndex] = (
      <Draggable
        onStart={() => this.handleDragStart(elementIndex)}
        onDrag={this.handleDragMove}
        onStop={this.handleDragEnd}
      >
        <Hammer
          options={this.hammerOptions}
          onRotateStart={e => this.handleHammerForSticker(e, elementIndex)}
          onRotateEnd={e => this.handleHammerForSticker(e, elementIndex)}
          onRotateMove={e => this.handleHammerForSticker(e, elementIndex)}
        >
          <div>
            <div
              id={"stickerImage" + elementIndex}
              className="custom-sticker-item"
            >
              <img
                src={sticker}
                alt="sticker"
                style={{ transform: "scale(0.5)" }}
              />
            </div>
          </div>
        </Hammer>
      </Draggable>
    );

    this.setState({
      stickerCustomiser: false,
      displayCustomiser: false,
      stickerOverlayTop: 110,
      customElementCount: this.state.customElementCount + 1
    });
  };

  downloadImageReady = canvas => {
    var imageData = canvas.toDataURL('image/jpeg', 1.0);
    this.setState({
      showRenderPortal: true,
      renderData: imageData,
      displayNotification: false
    });
  };

  captureScreenToImage = object => {
    this.setState({
      showRenderPortal: false,
      displayNotification: true
    });

    html2canvas(document.getElementById("toberendered")).then(function(canvas) {
      // document.body.appendChild(canvas);
      object.downloadImageReady(canvas);
    });
  };

  saveImage = () => {
    this.refs.finalDownload.click();
  };

  handleDragStart = elementIndex => {
    this.setState({
      displayCustomiser: true,
      displayTrash: true,
      currentDragIndex: elementIndex
    });
  };

  handleDragMove = (e, data) => {
    if (e.touches.length > 1) {
      return false;
    }

    var positionX = e.pageX;
    var positionY = e.pageY;
    if (e.touches) {
      var touch = e.touches[0];
      positionX = touch.pageX;
      positionY = touch.pageY;
    }

    if (this.isOverTrash(positionX, positionY)) {
      this.setState({
        trashHovered: true
      });
    } else {
      this.setState({
        trashHovered: false
      });
    }
  };

  handleDragEnd = (e, data) => {
    if (this.state.trashHovered) {
      if (this.state.currentDragIndex > -1) {
        this.customElements[this.state.currentDragIndex] = "";
      }
    }
    this.setState({
      displayCustomiser: false,
      displayTrash: false,
      currentDragIndex: 0
    });
  };

  render() {
    if (this.state.imageUrl === "") {
      return (
        <React.Fragment>
          <div className="insta-home">
            <input
              ref="fileUploader"
              type="file"
              className="hidden-image-picker"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={e => {
                this.routeChange(e);
              }}
            />
            <div
              className="icon-button disable_user_selection"
              onClick={this.launchImagePicker}
            >
              <div className="icon icon-story" />
              <div className="text">create your story</div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div
            className="loading-notification"
            style={{
              display: this.state.displayNotification ? "flex" : "none"
            }}
          >
            generating final image
          </div>
          <div
            className="delete-me-container"
            style={{ display: this.state.displayTrash ? "flex" : "none" }}
          >
            <div
              ref="trashBox"
              className={
                this.state.trashHovered
                  ? "icon icon-trash delete-me hovered ease-element"
                  : "icon icon-trash delete-me ease-element"
              }
            />
          </div>
          <div
            className="insta-stickers-editor insta-overlay-editor ease-element"
            style={{ top: this.state.stickerOverlayTop + "%" }}
          >
            <div
              className="overlay-notch"
              onClick={this.expandStickersOverlay}
            />
            <div className="sticker-container">
              <img
                src={Sticker1}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker1)}
              />
              <img
                src={Sticker2}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker2)}
              />
              <img
                src={Sticker3}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker3)}
              />
              <img
                src={Sticker4}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker4)}
              />
              <img
                src={Sticker5}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker5)}
              />
              <img
                src={Sticker6}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker6)}
              />
              <img
                src={Sticker7}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker7)}
              />
              <img
                src={Sticker8}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker8)}
              />
              <img
                src={Sticker9}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker9)}
              />
              <img
                src={Sticker10}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker10)}
              />
              <img
                src={Sticker11}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker11)}
              />
              <img
                src={Sticker12}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker12)}
              />
              <img
                src={Sticker13}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker13)}
              />
              <img
                src={Sticker14}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker14)}
              />
              <img
                src={Sticker15}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker15)}
              />
              <img
                src={Sticker16}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker16)}
              />
              <img
                src={Sticker17}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker17)}
              />
              <img
                src={Sticker18}
                alt="sticker"
                onClick={() => this.addStickerToCanvas(Sticker18)}
              />
            </div>
          </div>
          <div
            className="insta-brush-editor insta-overlay-editor"
            style={{ zIndex: this.state.brushCustomiser ? "100" : "0" }}
          >
            <div
              className="canvas-container"
              onPointerDown={this.hideBrushCustomiserOptions}
              onPointerUp={this.showBrushCustomiserOptions}
              onTouchStart={this.hideBrushCustomiserOptions}
              onTouchMove={this.hideBrushCustomiserOptions}
              onTouchEnd={this.showBrushCustomiserOptions}
            >
              <CanvasDraw
                ref="canvasPage"
                canvasHeight="100%"
                canvasWidth="100%"
                brushRadius={this.state.selectedBrushSize}
                brushColor={this.state.selectedBrushColor}
                hideGrid={true}
                catenaryColor="rgba(0,0,0,0)"
              />
            </div>
            <div
              style={{
                display: this.state.brushCustomiserOptions ? "block" : "none"
              }}
            >
              <div className="option-container brush-palette-container">
                <button onClick={this.undoBrushStroke}>Undo</button>
              </div>
              <div className="option-container brush-size-container">
                <Slider
                  vertical
                  min={1}
                  max={16}
                  defaultValue={this.state.selectedBrushSize}
                  className="brush-sizer"
                  onChange={this.setBrushSize}
                />
              </div>
              <div className="option-container color-palette-container">
                <button onClick={this.toggleBrushCustomiser}>Done</button>
                <div className="color-pallette">
                  <div
                    className={
                      this.state.selectedBrushColor === "#fdcb5c"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#fdcb5c" }}
                    onClick={() => this.setBrushColor("#fdcb5c")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#fd8d32"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#fd8d32" }}
                    onClick={() => this.setBrushColor("#fd8d32")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#d10869"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#d10869" }}
                    onClick={() => this.setBrushColor("#d10869")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#a307ba"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#a307ba" }}
                    onClick={() => this.setBrushColor("#a307ba")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#3897f0"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#3897f0" }}
                    onClick={() => this.setBrushColor("#3897f0")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#70c050"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#70c050" }}
                    onClick={() => this.setBrushColor("#70c050")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#000000"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#000000" }}
                    onClick={() => this.setBrushColor("#000000")}
                  />
                  <div
                    className={
                      this.state.selectedBrushColor === "#ffffff"
                        ? "color-item selected"
                        : "color-item"
                    }
                    style={{ backgroundColor: "#ffffff" }}
                    onClick={() => this.setBrushColor("#ffffff")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="insta-text-editor insta-overlay-editor ease-element"
            style={{ display: this.state.textCustomiser ? "block" : "none" }}
          >
            <div className="text-container">
              <textarea
                ref="textInput"
                style={{ color: this.state.selectedTextColor }}
              />
            </div>
            <div className="option-container">
              <button onClick={this.toggleTextCustomiser}>Done</button>
              <div className="color-pallette">
                <div
                  className={
                    this.state.selectedTextColor === "#fdcb5c"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#fdcb5c" }}
                  onClick={() => this.setTextColor("#fdcb5c")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#fd8d32"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#fd8d32" }}
                  onClick={() => this.setTextColor("#fd8d32")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#d10869"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#d10869" }}
                  onClick={() => this.setTextColor("#d10869")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#a307ba"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#a307ba" }}
                  onClick={() => this.setTextColor("#a307ba")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#3897f0"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#3897f0" }}
                  onClick={() => this.setTextColor("#3897f0")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#70c050"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#70c050" }}
                  onClick={() => this.setTextColor("#70c050")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#000000"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#000000" }}
                  onClick={() => this.setTextColor("#000000")}
                />
                <div
                  className={
                    this.state.selectedTextColor === "#ffffff"
                      ? "color-item selected"
                      : "color-item"
                  }
                  style={{ backgroundColor: "#ffffff" }}
                  onClick={() => this.setTextColor("#ffffff")}
                />
              </div>
            </div>
          </div>
          <div
            className="insta-page-options-container ease-element"
            style={{
              display: this.state.displayCustomiser ? "none" : "flex"
            }}
          >
            <div
              className="options-close icon icon-exit"
              onClick={this.discardImage}
            />
            <div className="options-others">
              <div
                className="icon icon-download"
                onClick={() => this.captureScreenToImage(this)}
              />
              <div
                className="icon icon-stickers"
                onClick={this.toggleStickerCustomiser}
              />
              <div
                className="icon icon-draw"
                onClick={this.toggleBrushCustomiser}
              />
              <div
                className="icon icon-text"
                onClick={this.toggleTextCustomiser}
              />
            </div>
          </div>
          <div
            className="insta-sticker-background-container ease-element"
            onClick={this.closeStickerOverlay}
            style={{
              display: this.state.stickerCustomiser ? "block" : "none"
            }}
          />
          <div id="toberendered" className="render-section">
            <div
              ref="customElementsContainer"
              className="insta-custom-elements-container ease-element"
            >
              {this.customElements}
            </div>
            <div
              ref="drawingElementsContainer"
              className="insta-drawing-elements-container ease-element"
            >
              {this.drawingElements}
            </div>
            <div className="insta-image-editor">
              <div className="image-container">
                <img src={this.state.imageUrl} alt="insta-bg" />
              </div>
            </div>
          </div>
          {this.state.showRenderPortal && (
            <FinalRender>
              <img src={this.state.renderData} alt="Insta render" />
            </FinalRender>
          )}
        </React.Fragment>
      );
    }
  }
}

export default Stories;
