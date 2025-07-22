document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("giftForm");
  const container = document.getElementById("giftContainer");

  const selectedOccasion = localStorage.getItem("selectedOccasion");
  if (!selectedOccasion) {
    alert("Please select an occasion on the homepage first.");
    window.location.href = "index.html";
    return;
  }

  const occasionSelect = document.getElementById("occasion");
  if (occasionSelect) {
    occasionSelect.style.display = "none";
  }

  // Restore gender selection from localStorage (if any)
  const genderSelect = document.getElementById("gender");
  if (genderSelect) {
    const savedGender = localStorage.getItem("gender");
    if (savedGender) {
      genderSelect.value = savedGender;
    }
  }

  const giftsData = {
    birthday: {
      tech: [
        { name: "Smartwatch", image: "smartwatch.webp", price: 15000 },
        { name: "Wireless Headphones", image: "Wireless Headphones.jpg", price: 12000 },
      ],
      jewelry: [
        { name: "Bracelet", image: "Fbracelet.jpg", price: 8000 },
        { name: "Necklace", image: "Fnecklace.jpg", price: 10000 },
        { name: "Bracelet", image: "Mbracelet.jpg", price: 7500 }
      ],
      "chocolate lover": [
        { name: "Chocolates", image: "Chocolates.jpg", price: 500 },
      ],
    },
    marriage: {
      jewelry: [
        { name: "Couple Rings", image: "couplerings.jpg", price: 8000 },
        { name: "Necklace", image: "Fnecklace.jpg", price: 20000 },
        { name: "Bracelet", image: "Fbracelet.jpg", price: 9000 },
        { name: "Bracelet", image: "Mbracelet.jpg", price: 7500 }
      ],
      tech: [
        { name: "Couple Watches", image: "couplewatches.jpg", price: 6000 },
      ],
    },
    diwali: {
      "chocolate lover": [
        { name: "Chocolates", image: "Chocolates.jpg", price: 700 },
      ],
      "sweet lover": [
        { name: "Sweets", image: "sweets.jpg", price: 1000 },
      ],
      "decorations lover": [
        { name: "Decorations", image: "decorations.jpg", price: 1500 },
      ],
      crackers: [
        { name: "Crackers", image: "crackers.jpg", price: 800 },
      ],
    },
  };

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const gender = document.getElementById("gender").value.trim().toLowerCase();
      const ageInput = document.getElementById("age").value.trim();
      const age = parseInt(ageInput);

      // Validate age
      if (isNaN(age)) {
        container.innerHTML = `<p>Please enter a valid age.</p>`;
        return;
      }

      if (selectedOccasion.toLowerCase() === "marriage") {
        if ((gender === "male" && age < 21) || (gender === "female" && age < 18)) {
          container.innerHTML = `<p>❌ The age entered was invalid. Marriage gift recommendations are only allowed for males 21+ and females 18+.</p>`;
          return;
        }
      }

      const budget = document.getElementById("budget").value.trim().toLowerCase();
      const interestsInput = document.getElementById("interests").value.trim().toLowerCase();

      // Save selections
      localStorage.setItem("gender", gender);
      localStorage.setItem("budget", budget);
      localStorage.setItem("interests", interestsInput);

      container.innerHTML = "";

      // Split interests to array
      const interests = interestsInput.split(",").map(i => i.trim()).filter(i => i.length > 0);

      const occasionGifts = giftsData[selectedOccasion.toLowerCase()];
      if (!occasionGifts) {
        container.innerHTML = `<p>No gifts found for the selected occasion.</p>`;
        return;
      }

      // Collect gifts matching interests
      let allMatchedGifts = [];

      for (const category in occasionGifts) {
        const categoryLower = category.toLowerCase();

        // Check if any interest matches category (partial match)
        const interestMatch = interests.some(i => categoryLower.includes(i));
        if (!interestMatch) continue;

        const categoryGifts = occasionGifts[category];
        allMatchedGifts = allMatchedGifts.concat(categoryGifts);
      }

      // Filter by budget (e.g. "up to 10000")
      if (budget) {
        // Expecting format like: "up to 10000" or "below 15000" or "10000+"
        // Let's extract max budget number loosely:
        const budgetNumber = budget.match(/\d+/);
        const maxBudget = budgetNumber ? parseInt(budgetNumber[0]) : 20000;

        allMatchedGifts = allMatchedGifts.filter(gift => gift.price <= maxBudget);
      }

      if (allMatchedGifts.length === 0) {
        container.innerHTML = `<p>No gifts matched your preferences.</p>`;
        return;
      }

      // Separate gifts by gender based on image filename prefix
      const maleGifts = [];
      const femaleGifts = [];

      for (const gift of allMatchedGifts) {
        const img = gift.image.toLowerCase();

        if (img.startsWith("m")) {
          maleGifts.push(gift);
        } else if (img.startsWith("f")) {
          femaleGifts.push(gift);
        } else if (img.startsWith("mf")) {
          maleGifts.push(gift);
          femaleGifts.push(gift);
        } else {
          // Neutral gifts go to both
          maleGifts.push(gift);
          femaleGifts.push(gift);
        }
      }

      container.innerHTML = "";

      // Show gifts only for selected gender
      const section = document.createElement("div");
      if (gender === "male") {
        section.innerHTML = `<h2>Gifts for Male</h2>`;
        if (maleGifts.length > 0) {
          maleGifts.forEach(gift => section.appendChild(createGiftCard(gift)));
        } else {
          section.innerHTML += `<p>No gifts available for males based on your filters.</p>`;
        }
      } else if (gender === "female") {
        section.innerHTML = `<h2>Gifts for Female</h2>`;
        if (femaleGifts.length > 0) {
          femaleGifts.forEach(gift => section.appendChild(createGiftCard(gift)));
        } else {
          section.innerHTML += `<p>No gifts available for females based on your filters.</p>`;
        }
      } else {
        section.innerHTML = `<p>Please select a valid gender.</p>`;
      }

      container.appendChild(section);
    });
  }

  function createGiftCard(gift) {
    const card = document.createElement("div");
    card.classList.add("gift-card");

    // Clean display name
    const displayName = gift.name.replace(/^(M|F|MF)\s*/i, "").trim();

    card.innerHTML = `
      <img src="${gift.image}" alt="${displayName}" style="width:150px; height:auto;" />
      <h3>${displayName}</h3>
      <p>₹${gift.price}</p>
      <button class="order-btn">Order</button>
    `;

    card.querySelector(".order-btn").addEventListener("click", () => {
      localStorage.setItem("selectedGift", JSON.stringify(gift));
      window.location.href = "order.html";
    });

    return card;
  }
});