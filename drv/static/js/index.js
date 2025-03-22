document.addEventListener("DOMContentLoaded", () => {
    // Quick View Modal Functionality
    const quickViewBtns = document.querySelectorAll(".quick-view-btn")
    const modal = document.getElementById("quick-view-modal")
    const closeModal = document.querySelector(".close-modal")
    const modalImage = document.getElementById("modal-image")
    const modalTitle = document.getElementById("modal-title")
    const modalCategory = document.getElementById("modal-category")
    const modalDescription = document.getElementById("modal-description")
    const modalFeatures = document.getElementById("modal-features")
    const viewDetailsLink = document.getElementById("view-details-link")
  
    // Open modal when clicking quick view button
    if (quickViewBtns.length > 0 && modal) {
      quickViewBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          e.stopPropagation()
  
          // Get the parent product item to access its data attributes
          const productItem = this.closest(".product-item")
  
          if (productItem) {
            // Get data from HTML data attributes
            const title = productItem.getAttribute("data-title")
            const category = productItem.getAttribute("data-category")
            const image = productItem.getAttribute("data-image")
            const description = productItem.getAttribute("data-description")
            const featuresString = productItem.getAttribute("data-features")
            const productUrl = productItem.getAttribute("data-product-url")
            const features = featuresString ? featuresString.split(",") : []
  
            // Populate modal with data
            modalImage.src = image
            modalTitle.textContent = title
            modalCategory.textContent = category
            modalDescription.textContent = description
  
            // Set the correct URL for the View Details button
            if (viewDetailsLink && productUrl) {
              viewDetailsLink.href = productUrl
              console.log("Setting view details link to:", productUrl)
            }
  
            // Clear and populate features list
            modalFeatures.innerHTML = ""
            features.forEach((feature) => {
              const li = document.createElement("li")
              li.textContent = feature.trim()
              modalFeatures.appendChild(li)
            })
  
            // Show modal
            modal.style.display = "block"
            document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
          }
        })
      })
  
      // Close modal when clicking the close button
      if (closeModal) {
        closeModal.addEventListener("click", () => {
          modal.style.display = "none"
          document.body.style.overflow = "auto" // Re-enable scrolling
        })
      }
  
      // Close modal when clicking outside the modal content
      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none"
          document.body.style.overflow = "auto"
        }
      })
    }
  
    // Prevent the quick view button from triggering the parent link
    document.querySelectorAll(".product-item a").forEach((link) => {
      link.addEventListener("click", (e) => {
        // If the click was on or inside the quick view button, prevent navigation
        if (e.target.closest(".quick-view-btn")) {
          e.preventDefault()
        }
      })
    })
  
    // Load More Products Functionality
    const loadMoreBtn = document.getElementById("load-more-btn")
    const hiddenProducts = document.querySelectorAll(".product-item.hidden")
  
    if (loadMoreBtn && hiddenProducts.length > 0) {
      let currentlyShown = document.querySelectorAll(".product-item:not(.hidden)").length
      const productsPerLoad = 10 // Load 10 more products on each click
  
      loadMoreBtn.addEventListener("click", () => {
        let count = 0
  
        hiddenProducts.forEach((product) => {
          if (product.classList.contains("hidden") && count < productsPerLoad) {
            product.classList.remove("hidden")
            count++
          }
        })
  
        // Update currently shown count
        currentlyShown += count
  
        // Hide the load more button if all products are shown
        const remainingHidden = document.querySelectorAll(".product-item.hidden").length
        if (remainingHidden === 0) {
          loadMoreBtn.style.display = "none"
        }
      })
    }
  
    // Product hover effects
    const productItems = document.querySelectorAll(".product-item")
  
    productItems.forEach((item) => {
      // Show quick view button on hover
      item.addEventListener("mouseenter", function () {
        const actions = this.querySelector(".product-actions")
        if (actions) {
          actions.style.opacity = "1"
          actions.style.transform = "translateY(0)"
        }
      })
  
      item.addEventListener("mouseleave", function () {
        const actions = this.querySelector(".product-actions")
        if (actions) {
          actions.style.opacity = "0"
          actions.style.transform = "translateY(-20px)"
        }
      })
    })
  })
  
  