document.addEventListener("DOMContentLoaded", function(){

      // Creating the main scene
      var scene = new THREE.Scene();

      // Setting up camera
      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 13, 600);

      // Setting up renderer
      var webGLRenderer = new THREE.WebGLRenderer();
      webGLRenderer.setClearColor(new THREE.Color(0x191f21));
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);
      webGLRenderer.shadowMap.enabled;

      // Set camera position
      camera.position.z = 90;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Add our renderer to the page
      document.body.appendChild(webGLRenderer.domElement);

      // Adding listener for window resize
      window.addEventListener('resize', onWindowResize);

      // Camera control
      document.addEventListener( 'mousemove', onMouseMove, false );
      var mouse = new THREE.Vector2();
      var target = new THREE.Vector2();

      // Resizing our canvas/renderer on window size change
      function onWindowResize(){
        width = window.innerWidth;
        height = window.innerHeight;
        updateRendererSize();
      }
      
      function updateRendererSize(){
        webGLRenderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      // Initialising our geometry
      // For properties visit: https://threejs.org/docs/#api/en/geometries/TorusKnotGeometry
      var radius = 60; // Float
      var tube = 12; // Float
      var tubularSegments = 230; // Integer
      var radialSegments = 13; // Integer
      var p = 12; // Integer
      var q = 3; // Integer

      var shape = new THREE.TorusKnotGeometry(radius, tube, Math.round(tubularSegments) , Math.round(radialSegments), Math.round(p), Math.round(q));
      var shape = shape.scale(1.2,1.2,3.0);
      console.log(shape)

      var shapePoints = createPoints(shape);

      // Adding our shape to the scene
      scene.add(shapePoints);

      render();

      // modified function from THREE.js examples: https://github.com/timoxley/threejs/blob/master/examples/canvas_particles_sprites.html
      function generateSprite() {

          var canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;

          var context = canvas.getContext('2d');
          var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
          gradient.addColorStop(0.01, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(0.13, 'rgba(0, 187, 187, 1)');
          gradient.addColorStop(0.16, 'rgba(0, 111, 127, 1)');
          gradient.addColorStop(0.20, 'rgba(20, 65, 69, 1)');
          gradient.addColorStop(0.25, 'rgba(13, 20, 21, 1)');
          gradient.addColorStop(0.60, 'rgba(0,0,0,1)');

          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);

          var sprite = new THREE.Texture(canvas);
          sprite.needsUpdate = true;
          return sprite;
      }

      function createPoints(shape) {
          var pointsMaterial = new THREE.PointsMaterial({
              color: 0xffffff,
              size: 2,
              transparent: true,
              blending: THREE.AdditiveBlending,
              map: generateSprite(),
              depthWrite: false
          });

          var points = new THREE.Points(shape, pointsMaterial);
          points.sortParticles = true;
          return points;
      }

      // Get mouse position 
      function onMouseMove(event) {
        mouse.x = event.clientX - (window.innerWidth / 2);
        mouse.y = event.clientY - (window.innerHeight / 2);
      }

      function render() {
        // Adding rotation to shapes
        shapePoints.rotation.y += 0.00003;
        shapePoints.rotation.z += -0.00003;
        // shapePoints.rotation.x += 0.00006;

        // Changing camera view based on mouse position
        target.x = ( 1 - mouse.x ) * 0.0002;
        target.y = ( 1 - mouse.y ) * 0.0002;
        camera.rotation.x += 0.01 * ( target.y - camera.rotation.x );
        camera.rotation.y += 0.01 * ( target.x - camera.rotation.y );
        
        // Rendering scene
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }
  });