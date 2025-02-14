<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drag and Rotate Papers</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    .paper {
      position: absolute;
      width: 200px;
      height: 200px;
      background-color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 20px;
      cursor: grab;
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="paper">Drag me!</div>
  <div class="paper">Rotate me!</div>
  <script src="script.js"></script>
</body>
</html>
