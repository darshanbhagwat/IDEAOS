const ideaInput = document.getElementById("ideaInput");
const buildButton = document.getElementById("buildButton");


// ==============================
// BUILD IDEA
// ==============================

buildButton.addEventListener("click", async function () {

    const idea = ideaInput.value.trim();

    if (idea === "") {
        alert("Please enter your idea first!");
        return;
    }

    buildButton.innerText = "AI is building your blueprint...";
    buildButton.disabled = true;

    try {

        const response = await fetch("https://ideaos-backend.onrender.com/build", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idea: idea
            })
        });

        if (!response.ok) {
            throw new Error("Backend error: " + response.status);
        }

        const data = await response.json();
        localStorage.setItem(
    "ideaos_current_idea",
    data.idea
);
// Reset research status for the new idea
localStorage.removeItem("ideaos_researched");
localStorage.removeItem("ideaos_research_sources");
localStorage.removeItem("ideaos_researched_idea");
localStorage.setItem(
    "ideaos_category",
    data.category || "Other"
);
localStorage.setItem("ideaos_version", "1");

localStorage.setItem("ideaos_version", "1");

localStorage.setItem(
    "ideaos_target_users",
    data.target_users || ""
);

localStorage.setItem(
    "ideaos_problem",
    data.problem || ""
);

localStorage.setItem(
    "ideaos_solution",
    data.solution || ""
);

localStorage.setItem(
    "ideaos_core_product",
    data.core_product || ""
);

localStorage.setItem(
    "ideaos_business_model",
    data.business_model || ""
);

localStorage.setItem(
    "ideaos_key_features",
    data.key_features || ""
);

localStorage.setItem(
    "ideaos_marketing",
    data.marketing || ""
);

localStorage.setItem(
    "ideaos_risks",
    data.risks || ""
);

localStorage.setItem(
    "ideaos_next_step",
    data.next_step || ""
);

localStorage.setItem(
    "ideaos_created_at",
    new Date().toISOString()
);
localStorage.setItem(
    "ideaos_evolution",
    JSON.stringify([
        {
            version: 1,
            idea: data.idea
        }
    ])
);

        console.log("AI RESPONSE:", data);

        document.querySelector(".container").innerHTML = `
            <h1>IDEAOS</h1>
            <p>One idea. Everything you need.</p>

            <div class="result">

                <div class="card">
                    <h2>💡 Your Idea</h2>
                    <p>${data.idea || "No result"}</p>
                </div>

                <div class="card">
                    <h2>🎯 Target Users</h2>
                    <p>${data.target_users || "No result"}</p>
                </div>

                <div class="card">
                    <h2>❗ Problem</h2>
                    <p>${data.problem || "No result"}</p>
                </div>

                <div class="card">
                    <h2>💡 Solution</h2>
                    <p>${data.solution || "No result"}</p>
                </div>

                <div class="card">
                    <h2>🛠️ Core Product</h2>
                    <p>${data.core_product || "No result"}</p>
                </div>

                <div class="card">
                    <h2>💰 Business Model</h2>
                    <p>${data.business_model || "No result"}</p>
                </div>

                <div class="card">
                    <h2>⚙️ Key Features</h2>
                    <p>${data.key_features || "No result"}</p>
                </div>

                <div class="card">
                    <h2>📢 Marketing</h2>
                    <p>${data.marketing || "No result"}</p>
                </div>

                <div class="card">
                    <h2>⚠️ Risks</h2>
                    <p>${data.risks || "No result"}</p>
                </div>

                <div class="card">
                    <h2>🚀 Next Step</h2>
                    <p>${data.next_step || "No result"}</p>
                </div>

            </div>

            <div class="actions">

                <button onclick="improveIdea()">
                    ✨ Improve This Idea
                </button>

                <button onclick="saveIdea()">
                    💾 Save This Idea
                </button>

                <button onclick="showHistory()">
                    📚 Saved Ideas
                </button>

                <button onclick="location.reload()">
                    ← Build Another Idea
                </button>

            </div>
        `;

    } catch (error) {

        console.error("BUILD ERROR:", error);

        alert("Something went wrong. Check the browser console.");

        buildButton.innerText = "Build My Idea 🚀";
        buildButton.disabled = false;
    }
});


// ==============================
// IMPROVE IDEA
// ==============================

async function improveIdea() {

    const currentIdea =
    localStorage.getItem("ideaos_current_idea") ||
    document.querySelector(".card p").innerText;

    const button = event.target;

    button.innerText = "✨ Improving...";
    button.disabled = true;

    try {

        const response = await fetch("https://ideaos-backend.onrender.com/improve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idea: currentIdea
            })
        });

        if (!response.ok) {
            throw new Error("Backend error: " + response.status);
        }

        const data = await response.json();
        localStorage.setItem(
    "ideaos_current_idea",
    data.improved_idea
);
let version = Number(
    localStorage.getItem("ideaos_version") || "1"
);

version++;

localStorage.setItem(
    "ideaos_version",
    version
);


// Add improved idea to evolution history
let evolution = JSON.parse(
    localStorage.getItem("ideaos_evolution") || "[]"
);

evolution.push({
    version: version,
    idea: data.improved_idea,
    date: new Date().toISOString()
});

localStorage.setItem(
    "ideaos_evolution",
    JSON.stringify(evolution)
);

        console.log("IMPROVED IDEA:", data);

        document.querySelector(".container").innerHTML = `
            <h1>IDEAOS</h1>
            <p>✨ Your idea evolved</p>

            <div class="result">

                <div class="card">
    <h2>📌 Version 1</h2>
    <p>${currentIdea}</p>
</div>

<div class="card">
   <h2>🚀 Version ${localStorage.getItem("ideaos_version")}</h2>
    <p>${data.improved_idea || "No result"}</p>
</div>

                <div class="card">
                    <h2>💡 Why It's Better</h2>
                    <p>${data.why_better || "No result"}</p>
                </div>

                <div class="card">
                    <h2>⚙️ New Features</h2>
                    <p>${data.new_features || "No result"}</p>
                </div>

                <div class="card">
                    <h2>🎯 Target Users</h2>
                    <p>${data.target_users || "No result"}</p>
                </div>

                <div class="card">
                    <h2>🚀 Next Step</h2>
                    <p>${data.next_step || "No result"}</p>
                </div>

            </div>

            <div class="actions">

                <button onclick="improveIdea()">
    ✨ Improve Again
</button>

<button onclick="saveIdea()">
    💾 Save This Idea
</button>

<button onclick="showHistory()">
    📚 Saved Ideas
</button>
<button onclick="showEvolution()">
    📈 Idea Evolution
</button>

<button onclick="location.reload()">
    ← Build Another Idea
</button>

            </div>
        `;

    } catch (error) {

        console.error("IMPROVE ERROR:", error);

        alert("Could not improve the idea.");

        button.innerText = "✨ Improve This Idea";
        button.disabled = false;
    }
}


// ==============================
// SAVE IDEA
// ==============================

async function saveIdea() {

const idea =
    localStorage.getItem("ideaos_current_idea") ||
    document.querySelector(".card p").innerText;
    
const ideaId = "IDEA-" + Date.now();
localStorage.setItem("ideaos_id", ideaId);
    try {

        const response = await fetch("https://ideaos-backend.onrender.com/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify({

    idea_id: ideaId,

    idea: idea,

    target_users:
        localStorage.getItem("ideaos_target_users") || "",

    problem:
        localStorage.getItem("ideaos_problem") || "",

    solution:
        localStorage.getItem("ideaos_solution") || "",

    core_product:
        localStorage.getItem("ideaos_core_product") || "",

    business_model:
        localStorage.getItem("ideaos_business_model") || "",

    key_features:
        localStorage.getItem("ideaos_key_features") || "",

    marketing:
        localStorage.getItem("ideaos_marketing") || "",

    risks:
        localStorage.getItem("ideaos_risks") || "",

    next_step:
        localStorage.getItem("ideaos_next_step") || "",

    version: Number(
        localStorage.getItem("ideaos_version") || "1"
    ),

    evolution: JSON.parse(
        localStorage.getItem("ideaos_evolution") || "[]"
    ),

    category:
        localStorage.getItem("ideaos_category") || "Other",

    created_at:
        localStorage.getItem("ideaos_created_at") || "",

    updated_at:
        new Date().toISOString()

})
        });

        if (!response.ok) {
            throw new Error("Could not save idea");
        }

        const data = await response.json();

        alert("💾 " + data.message);

    } catch (error) {

        console.error("SAVE ERROR:", error);

        alert("❌ Could not save the idea.");
    }
}

// ==============================
// SHOW EVOLUTION
// ==============================

function showEvolution() {

    const evolution = JSON.parse(
        localStorage.getItem("ideaos_evolution") || "[]"
    );
    evolution.forEach(item => {
    if (!item.date) {
        item.date = new Date().toISOString();
    }
});

    const container = document.querySelector(".container");

    if (evolution.length === 0) {

        container.innerHTML = `
            <h1>IDEAOS</h1>
            <p>🧬 Idea Evolution</p>

            <div class="card">
                <h2>No evolution yet</h2>
                <p>Improve your idea to create its first evolution step.</p>
            </div>

            <div class="actions">
                <button onclick="showDashboard()">
                    📊 Dashboard
                </button>

                <button onclick="location.reload()">
                    ← Back
                </button>
            </div>
        `;

        return;
    }

    let timeline = "";

    evolution.forEach((item, index) => {

        timeline += `
            <div class="card evolution-card">

                <h2>
                    🧬 Version ${item.version}
                </h2>

                <p>${item.idea}</p>

<p class="evolution-date">
    📅 ${
        item.date
            ? new Date(item.date).toLocaleString()
            : "Date not available"
    }
</p>

                ${
                    index < evolution.length - 1
                    ? `<div class="evolution-arrow">↓</div>`
                    : ""
                }

            </div>
        `;
    });

    container.innerHTML = `
        <h1>IDEAOS</h1>

        <p>🧬 Idea Evolution</p>

        <div class="evolution-timeline">
            ${timeline}
        </div>

        <div class="actions">

            <button onclick="continueCurrentIdea()">
                🚀 Continue Current Idea
            </button>

            <button onclick="showDashboard()">
                📊 Dashboard
            </button>

            <button onclick="showHistory()">
                📚 Saved Ideas
            </button>

            <button onclick="location.reload()">
                ← Build Another Idea
            </button>

        </div>
    `;
}
// ==============================
// SHOW HISTORY
// ==============================

async function showHistory() {

    try {

        const response = await fetch("https://ideaos-backend.onrender.com/ideas");

        if (!response.ok) {
            throw new Error("Could not load saved ideas");
        }

        const ideas = await response.json();

        const container = document.querySelector(".container");

        if (ideas.length === 0) {

            container.innerHTML = `
                <h1>IDEAOS</h1>
                <p>📚 Your Saved Ideas</p>

                <div class="card">
                    <h2>No saved ideas yet</h2>
                    <p>Build an idea and save it to see it here.</p>
                </div>

                <div class="actions">
                    <button onclick="location.reload()">
                        ← Back
                    </button>
                </div>
            `;

            return;
        }

        let cards = "";

       ideas.forEach((item, index) => {

    cards += `
        <div class="card">

            <h2>💡 Idea ${index + 1}</h2>

         <p>${item.idea}</p>

<p class="idea-category">
    🏷️ ${item.category || "Other"}
</p>
<p class="idea-date">
    📅 Created: ${item.created_at
        ? new Date(item.created_at).toLocaleString()
        : "Not available"}
</p>

<p class="idea-date">
    🔄 Updated: ${item.updated_at
        ? new Date(item.updated_at).toLocaleString()
        : "Not available"}
</p>
<button onclick="openSavedIdea(${index})">
    🚀 Open Idea
</button>

<button onclick="editSavedIdea(${index})">
    ✏️ Edit Idea
</button>

<button onclick="deleteIdea(${index})">
    🗑️ Delete
</button>

        </div>
    `;

});

        container.innerHTML = `
    <h1>IDEAOS</h1>
    <p>📚 Your Saved Ideas</p>

    <input
        type="text"
        id="savedIdeaSearch"
        placeholder="🔍 Search saved ideas..."
        oninput="filterSavedIdeas()"
    >
    <select id="categoryFilter" onchange="filterSavedIdeas()">
    <option value="all">All Categories</option>
    <option value="AI">AI</option>
    <option value="E-commerce">E-commerce</option>
    <option value="Fitness">Fitness</option>
    <option value="Education">Education</option>
    <option value="Space">Space</option>
    <option value="Other">Other</option>
</select>

    <div class="result">${cards}</div>

            <div class="actions">

                <button onclick="location.reload()">
                    ← Build Another Idea
                </button>

            </div>
        `;

    } catch (error) {

        console.error("HISTORY ERROR:", error);

        alert("❌ Could not load saved ideas.");
    }
}


// ==============================
// DELETE IDEA
// ==============================

async function deleteIdea(index) {

    const confirmed = confirm(
        "Are you sure you want to delete this idea?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `https://ideaos-backend.onrender.com/ideas/${index}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Could not delete idea");
        }

        const data = await response.json();

        alert("🗑️ " + data.message);

        showHistory();

    } catch (error) {

        console.error("DELETE ERROR:", error);

        alert("❌ Could not delete the idea.");
    }
}
// ==============================
// OPEN SAVED IDEA
// ==============================

async function openSavedIdea(index) {

    try {

        const response = await fetch("https://ideaos-backend.onrender.com/ideas");

        if (!response.ok) {
            throw new Error("Could not load saved ideas");
        }

        const ideas = await response.json();

        const item = ideas[index];

        if (!item) {
            alert("❌ Idea not found.");
            return;
        }

        // Restore selected idea
        localStorage.setItem(
            "ideaos_current_idea",
            item.idea
        );
        localStorage.setItem(
    "ideaos_target_users",
    item.target_users || ""
);

localStorage.setItem(
    "ideaos_problem",
    item.problem || ""
);

localStorage.setItem(
    "ideaos_solution",
    item.solution || ""
);

localStorage.setItem(
    "ideaos_core_product",
    item.core_product || ""
);

localStorage.setItem(
    "ideaos_business_model",
    item.business_model || ""
);

localStorage.setItem(
    "ideaos_key_features",
    item.key_features || ""
);

localStorage.setItem(
    "ideaos_marketing",
    item.marketing || ""
);

localStorage.setItem(
    "ideaos_risks",
    item.risks || ""
);

localStorage.setItem(
    "ideaos_next_step",
    item.next_step || ""
);

        localStorage.setItem(
            "ideaos_id",
            item.idea_id || "IDEA-" + Date.now()
        );

        localStorage.setItem(
            "ideaos_category",
            item.category || "Other"
        );
        localStorage.setItem(
    "ideaos_created_at",
    item.created_at || ""
);

        localStorage.setItem(
            "ideaos_version",
            item.version || 1
        );

        localStorage.setItem(
            "ideaos_evolution",
            JSON.stringify(
                item.evolution || [
                    {
                        version: item.version || 1,
                        idea: item.idea
                    }
                ]
            )
        );

        // Go directly to the current idea
        continueCurrentIdea();

    } catch (error) {

        console.error("OPEN IDEA ERROR:", error);

        alert("❌ Could not open the saved idea.");
    }
}
async function editSavedIdea(index) {

    try {

        const response = await fetch(
            "https://ideaos-backend.onrender.com/ideas"
        );

        if (!response.ok) {
            throw new Error("Could not load saved ideas");
        }

        const ideas = await response.json();
        const item = ideas[index];

        if (!item) {
            alert("❌ Idea not found.");
            return;
        }

        const newIdea = prompt(
            "✏️ Edit your idea:",
            item.idea
        );

        if (newIdea === null) {
            return;
        }

        if (!newIdea.trim()) {
            alert("❌ Idea cannot be empty.");
            return;
        }

        localStorage.setItem(
            "ideaos_current_idea",
            newIdea.trim()
        );

        localStorage.setItem(
            "ideaos_id",
            item.idea_id || ""
        );

        localStorage.setItem(
            "ideaos_category",
            item.category || "Other"
        );

        localStorage.setItem(
            "ideaos_version",
            item.version || 1
        );

        localStorage.setItem(
            "ideaos_evolution",
            JSON.stringify(item.evolution || [])
        );

        continueCurrentIdea();

    } catch (error) {

        console.error("EDIT IDEA ERROR:", error);

        alert("❌ Could not edit the idea.");
    }
}
// ==============================
// DASHBOARD
// ==============================

async function showDashboard() {

    try {

        const response = await fetch("https://ideaos-backend.onrender.com/ideas");

        if (!response.ok) {
            throw new Error("Could not load dashboard data");
        }

        const ideas = await response.json();

        const container = document.querySelector(".container");

        const savedCount = ideas.length;

        const currentVersion = Number(
            localStorage.getItem("ideaos_version") || "0"
        );

        const evolution = JSON.parse(
            localStorage.getItem("ideaos_evolution") || "[]"
        );

        const evolutionCount = evolution.length;

        const latestIdea =
            localStorage.getItem("ideaos_current_idea") ||
            "No current idea";

        const isResearched =
            localStorage.getItem("ideaos_researched") === "true" &&
            localStorage.getItem("ideaos_researched_idea") ===
            localStorage.getItem("ideaos_current_idea");

        const researchSources =
            localStorage.getItem("ideaos_research_sources") || "0";

        container.innerHTML = `

            <h1>IDEAOS</h1>

            <p>📊 Your Idea Dashboard</p>

            <div class="result">

                <div class="card dashboard-card">
                    <h2>💡 Saved Ideas</h2>
                    <p>${savedCount}</p>
                </div>

                <div class="card dashboard-card">
                    <h2>📈 Current Version</h2>
                    <p>Version ${currentVersion}</p>
                </div>

                <div class="card dashboard-card">
                    <h2>🧬 Evolution Steps</h2>
                    <p>${evolutionCount}</p>
                </div>

                <div class="card dashboard-card">
                    <h2>🏷️ Category</h2>
                    <p>
                        ${localStorage.getItem("ideaos_category") || "Other"}
                    </p>
                </div>

                <div class="card dashboard-card dashboard-latest">

                    <h2>🚀 Latest Idea</h2>

                    <p>${latestIdea}</p>

                </div>

                <div class="card dashboard-card research-status-card">

                    <h2>🔎 Research Status</h2>

                    ${
                        isResearched
                            ? `
                                <p>✅ Researched</p>
                                <small>
                                    ${researchSources} sources analyzed
                                </small>
                              `
                            : `
                                <p>⏳ Not researched yet</p>
                                <small>
                                    Research your current idea to see market insights.
                                </small>
                              `
                    }

                </div>

            </div>

            <h2 class="dashboard-section-title">
                ⚡ Quick Actions
            </h2>

            <div class="actions">

                <button onclick="showHistory()">
                    📚 Saved Ideas
                </button>

                <button onclick="continueCurrentIdea()">
                    🚀 Continue Current Idea
                </button>

                <button onclick="researchCurrentIdea()">
                    🔎 Research Current Idea
                </button>

                <button onclick="showEvolution()">
                    🧬 Idea Evolution
                </button>

                <button onclick="location.reload()">
                    ➕ Build Another Idea
                </button>

            </div>

        `;

    } catch (error) {

        console.error("DASHBOARD ERROR:", error);

        alert("❌ Could not load dashboard.");
    }
}
// ==============================
// CONTINUE CURRENT IDEA
// ==============================

function continueCurrentIdea() {

    const currentIdea =
        localStorage.getItem("ideaos_current_idea");

    if (!currentIdea) {
        alert("❌ No current idea found. Build an idea first.");
        return;
    }

    const container = document.querySelector(".container");

    const version = Number(
        localStorage.getItem("ideaos_version") || "1"
    );

    container.innerHTML = `

        <h1>IDEAOS</h1>

        <p>🚀 Continue Your Idea</p>

        <div class="result">

    <div class="card">
        <h2>💡 Current Idea</h2>
        <p>${currentIdea}</p>
    </div>

    <div class="card">
        <h2>📈 Current Version</h2>
<p>Version ${version}</p>
    </div>

    <div class="card">
        <h2>🎯 Target Users</h2>
        <p>${localStorage.getItem("ideaos_target_users") || "No result"}</p>
    </div>

    <div class="card">
        <h2>❗ Problem</h2>
        <p>${localStorage.getItem("ideaos_problem") || "No result"}</p>
    </div>

    <div class="card">
        <h2>💡 Solution</h2>
        <p>${localStorage.getItem("ideaos_solution") || "No result"}</p>
    </div>

    <div class="card">
        <h2>🛠️ Core Product</h2>
        <p>${localStorage.getItem("ideaos_core_product") || "No result"}</p>
    </div>

    <div class="card">
        <h2>💰 Business Model</h2>
        <p>${localStorage.getItem("ideaos_business_model") || "No result"}</p>
    </div>

    <div class="card">
        <h2>⚙️ Key Features</h2>
        <p>${localStorage.getItem("ideaos_key_features") || "No result"}</p>
    </div>

    <div class="card">
        <h2>📢 Marketing</h2>
        <p>${localStorage.getItem("ideaos_marketing") || "No result"}</p>
    </div>

    <div class="card">
        <h2>⚠️ Risks</h2>
        <p>${localStorage.getItem("ideaos_risks") || "No result"}</p>
    </div>

    <div class="card">
        <h2>🚀 Next Step</h2>
        <p>${localStorage.getItem("ideaos_next_step") || "No result"}</p>
    </div>

</div>

        <div class="actions">

            <button onclick="improveIdea()">
                ✨ Improve Again
            </button>

            <button onclick="showEvolution()">
                📈 Idea Evolution
            </button>

            <button onclick="saveIdea()">
    💾 Save This Idea
</button>

<button onclick="researchCurrentIdea()">
    🔎 Research My Idea
</button>

<button onclick="editBlueprint()">
    ✏️ Edit Blueprint
</button>

            <button onclick="showDashboard()">
                📊 Dashboard
            </button>

        </div>

    `;
}
function filterSavedIdeas() {

    const searchInput = document.getElementById("savedIdeaSearch");
    const categoryFilter = document.getElementById("categoryFilter");

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const cards = document.querySelectorAll(".result .card");

    cards.forEach(card => {

        const ideaText = card
            .querySelector("p")
            .innerText
            .toLowerCase();

        const categoryElement =
            card.querySelector(".idea-category");

        const categoryText = categoryElement
            ? categoryElement.innerText
                .replace("🏷️", "")
                .trim()
                .toLowerCase()
            : "other";

        const matchesSearch =
            ideaText.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            categoryText === selectedCategory.toLowerCase();

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });
}
// ==============================
// EDIT BLUEPRINT
// ==============================

function editBlueprint() {

    const container = document.querySelector(".container");

    container.innerHTML = `
        <h1>IDEAOS</h1>
        <p>✏️ Edit Your Blueprint</p>

        <div class="result">

            <div class="card">
                <h2>🎯 Target Users</h2>
                <textarea id="editTargetUsers">${localStorage.getItem("ideaos_target_users") || ""}</textarea>
            </div>

            <div class="card">
                <h2>❗ Problem</h2>
                <textarea id="editProblem">${localStorage.getItem("ideaos_problem") || ""}</textarea>
            </div>

            <div class="card">
                <h2>💡 Solution</h2>
                <textarea id="editSolution">${localStorage.getItem("ideaos_solution") || ""}</textarea>
            </div>

            <div class="card">
                <h2>🛠️ Core Product</h2>
                <textarea id="editCoreProduct">${localStorage.getItem("ideaos_core_product") || ""}</textarea>
            </div>

            <div class="card">
                <h2>💰 Business Model</h2>
                <textarea id="editBusinessModel">${localStorage.getItem("ideaos_business_model") || ""}</textarea>
            </div>

            <div class="card">
                <h2>⚙️ Key Features</h2>
                <textarea id="editKeyFeatures">${localStorage.getItem("ideaos_key_features") || ""}</textarea>
            </div>

            <div class="card">
                <h2>📢 Marketing</h2>
                <textarea id="editMarketing">${localStorage.getItem("ideaos_marketing") || ""}</textarea>
            </div>

            <div class="card">
                <h2>⚠️ Risks</h2>
                <textarea id="editRisks">${localStorage.getItem("ideaos_risks") || ""}</textarea>
            </div>

            <div class="card">
                <h2>🚀 Next Step</h2>
                <textarea id="editNextStep">${localStorage.getItem("ideaos_next_step") || ""}</textarea>
            </div>

        </div>

        <div class="actions">

            <button onclick="saveBlueprintChanges()">
                💾 Save Blueprint Changes
            </button>

            <button onclick="continueCurrentIdea()">
                ← Cancel
            </button>

        </div>
    `;
}
// ==============================
// SAVE BLUEPRINT CHANGES
// ==============================

function saveBlueprintChanges() {

    localStorage.setItem(
        "ideaos_target_users",
        document.getElementById("editTargetUsers").value
    );

    localStorage.setItem(
        "ideaos_problem",
        document.getElementById("editProblem").value
    );

    localStorage.setItem(
        "ideaos_solution",
        document.getElementById("editSolution").value
    );

    localStorage.setItem(
        "ideaos_core_product",
        document.getElementById("editCoreProduct").value
    );

    localStorage.setItem(
        "ideaos_business_model",
        document.getElementById("editBusinessModel").value
    );

    localStorage.setItem(
        "ideaos_key_features",
        document.getElementById("editKeyFeatures").value
    );

    localStorage.setItem(
        "ideaos_marketing",
        document.getElementById("editMarketing").value
    );

    localStorage.setItem(
        "ideaos_risks",
        document.getElementById("editRisks").value
    );

    localStorage.setItem(
        "ideaos_next_step",
        document.getElementById("editNextStep").value

    );
    // Create a new blueprint version
let version = Number(
    localStorage.getItem("ideaos_version") || "1"
);

version++;

localStorage.setItem(
    "ideaos_version",
    version
);

// Add this version to evolution history
let evolution = JSON.parse(
    localStorage.getItem("ideaos_evolution") || "[]"
);

evolution.push({
    version: version,
    idea: localStorage.getItem("ideaos_current_idea") || "",
    date: new Date().toISOString(),
    type: "Blueprint Edited"
});

localStorage.setItem(
    "ideaos_evolution",
    JSON.stringify(evolution)
);

    alert("✅ Blueprint changes saved!");

    continueCurrentIdea();
}
function researchCurrentIdea() {

    const currentIdea =
        localStorage.getItem("ideaos_current_idea") || "";

    if (!currentIdea) {
        alert("❌ No current idea found.");
        return;
    }

    const container = document.querySelector(".container");

    // Create the input that researchIdea() expects
    const hiddenInput = document.createElement("input");
    hiddenInput.id = "ideaInput";
    hiddenInput.value = currentIdea;
    hiddenInput.style.display = "none";

    // Create the results area that researchIdea() expects
    const researchResults = document.createElement("div");
    researchResults.id = "researchResults";
    researchResults.className = "result";

    container.appendChild(hiddenInput);
    container.appendChild(researchResults);

   researchIdea();

setTimeout(() => {
    const actions = document.createElement("div");
    actions.className = "actions";

    actions.innerHTML = `
        <button onclick="improveWithResearch()">
            ✨ Improve With Research
        </button>
    `;

    document.querySelector(".container").appendChild(actions);
}, 500);
}
async function researchIdea() {
    const idea = document.getElementById("ideaInput").value.trim();
    const resultsDiv = document.getElementById("researchResults");

    if (!idea) {
        alert("Please enter your idea first.");
        return;
    }

    resultsDiv.innerHTML = `
    <div class="research-loading premium-research-loader">

        <div class="research-orbit">
            <div class="research-core">🔎</div>
            <span></span>
            <span></span>
            <span></span>
        </div>

        <h2>Researching Your Idea</h2>

        <p class="research-loader-subtitle">
            IDEAOS is analyzing the market...
        </p>

        <div class="research-steps">

            <div class="research-step active">
                <span>🌐</span>
                <p>Scanning web sources</p>
            </div>

            <div class="research-step">
                <span>🏢</span>
                <p>Analyzing competitors</p>
            </div>

            <div class="research-step">
                <span>📈</span>
                <p>Finding market opportunities</p>
            </div>

            <div class="research-step">
                <span>💡</span>
                <p>Generating insights</p>
            </div>

        </div>

        <div class="research-progress">
            <div class="research-progress-bar"></div>
        </div>

        <p class="research-loader-note">
            This may take a few seconds...
        </p>

    </div>
`;

    try {
        const response = await fetch(
            "https://ideaos-backend.onrender.com/full-research",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: idea
                })
            }
        );

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || "Research failed.");
        }

        const analysis =
            typeof data.analysis === "string"
                ? JSON.parse(data.analysis)
                : data.analysis;

// Save research status for the current idea
localStorage.setItem("ideaos_researched", "true");
localStorage.setItem(
    "ideaos_research_sources",
    String(data.sources?.length || 0)
);
localStorage.setItem(
    "ideaos_researched_idea",
    idea
);

        let competitorsHTML = "";

        if (Array.isArray(analysis.competitors)) {
            analysis.competitors.forEach(competitor => {
                competitorsHTML += `
                    <div class="research-item">
                        <h4>🏢 ${competitor.name || "Competitor"}</h4>

                        ${
                            Array.isArray(competitor.evidence)
                                ? `<ul>
                                    ${competitor.evidence.map(item => `
                                        <li>${item}</li>
                                    `).join("")}
                                   </ul>`
                                : ""
                        }
                    </div>
                `;
            });
        }

        const createList = (items) => {
            if (!Array.isArray(items)) return "<p>No data available.</p>";

            return `
                <ul>
                    ${items.map(item => {
                        if (typeof item === "string") {
                            return `<li>${item}</li>`;
                        }

                        return `
                            <li>
                                ${
                                    item.finding ||
                                    item.opportunity ||
                                    item.strategy ||
                                    item.recommendation ||
                                    item.type ||
                                    JSON.stringify(item)
                                }
                            </li>
                        `;
                    }).join("")}
                </ul>
            `;
        };

        resultsDiv.innerHTML = `
            <div class="research-header">
                <h2>🔎 Research Results</h2>
                <p>Research analysis for: <strong>${idea}</strong></p>
            </div>
<div class="research-sources">

    <h3>🌐 Research Sources</h3>

    <div class="research-source-grid">

        ${
            (data.sources || []).map((source, index) => `
                
                <div class="research-source-card">

                    <div class="source-number">
                        ${index + 1}
                    </div>

                    <div class="source-info">

                        <h4>
                            ${source.title || "Research Source"}
                        </h4>

                        <p>
                            ${source.url || ""}
                        </p>

                    </div>

                    <a
                        href="${source.url || "#"}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="source-button"
                    >
                        Visit Source ↗
                    </a>

                </div>

            `).join("")
        }

    </div>

</div>
            <div class="research-grid">

                <div class="research-card">
                    <h3>🏆 Competitors</h3>
                    ${competitorsHTML || "<p>No competitors found.</p>"}
                </div>

                <div class="research-card">
                    <h3>⚙️ Existing Features</h3>
                    ${createList(analysis.existing_features)}
                </div>

                <div class="research-card">
                    <h3>📈 Market Opportunities</h3>
                    ${createList(analysis.market_opportunities)}
                </div>

                <div class="research-card">
                    <h3>⚠️ Problems & Gaps</h3>
                    ${createList(analysis.problems_and_gaps)}
                </div>

                <div class="research-card">
                    <h3>💡 Differentiation</h3>
                    ${createList(analysis.differentiation)}
                </div>

                <div class="research-card">
                    <h3>🎯 Recommendations</h3>
                    ${createList(analysis.recommendations)}
                </div>

            </div>
        `;

    } catch (error) {
        console.error(error);

        resultsDiv.innerHTML = `
            <div class="research-error">
                <h2>❌ Research Failed</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}
async function improveWithResearch() {

    const resultsDiv = document.getElementById("researchResults");

    resultsDiv.innerHTML = `
        <div class="research-loading premium-research-loader">

            <div class="research-orbit">
                <div class="research-core">✨</div>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <h2>Improving Your Idea With Research</h2>

            <p class="research-loader-subtitle">
                IDEAOS is combining market research with AI...
            </p>

            <div class="research-steps">

                <div class="research-step active">
                    <span>🔎</span>
                    <p>Understanding your idea</p>
                </div>

                <div class="research-step">
                    <span>🌐</span>
                    <p>Analyzing research</p>
                </div>

                <div class="research-step">
                    <span>🏢</span>
                    <p>Comparing competitors</p>
                </div>

                <div class="research-step">
                    <span>🧠</span>
                    <p>Improving your idea</p>
                </div>

            </div>

            <div class="research-progress">
                <div class="research-progress-bar"></div>
            </div>

            <p class="research-loader-note">
                This may take a few seconds...
            </p>

        </div>
    `;
    const idea = document.getElementById("ideaInput").value.trim();
    
    if (!idea) {
        alert("Please enter your idea first.");
        return;
    }

    try {
        // First get fresh research
        const researchResponse = await fetch(
            "https://ideaos-backend.onrender.com/full-research",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: idea
                })
            }
        );

        const researchData = await researchResponse.json();

        if (!researchResponse.ok || researchData.error) {
            throw new Error(
                researchData.error || "Research failed."
            );
        }

        // Send research to the AI improvement endpoint
        const improvementResponse = await fetch(
            "https://ideaos-backend.onrender.com/improve-with-research",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idea: idea,
                    research: researchData.analysis
                })
            }
        );

        const improvementData = await improvementResponse.json();

        if (!improvementResponse.ok || improvementData.error) {
            throw new Error(
                improvementData.error || "Idea improvement failed."
            );
        }

        const improvement =
            typeof improvementData.improvement === "string"
                ? JSON.parse(improvementData.improvement)
                : improvementData.improvement;

       const createList = (items) => {

    // If AI returned nothing
    if (!items) {
        return "<p>No data available.</p>";
    }

    // If AI returned a JSON string
    if (typeof items === "string") {
        try {
            items = JSON.parse(items);
        } catch {
            return `<p>${items}</p>`;
        }
    }

    // If it is an array
    if (Array.isArray(items)) {

        if (items.length === 0) {
            return "<p>No data available.</p>";
        }

        return `
            <ul>
                ${items.map(item => {

                    if (typeof item === "string") {
                        return `<li>${item}</li>`;
                    }

                    if (typeof item === "object" && item !== null) {

                        const value =
                            item.step ||
                            item.plan ||
                            item.action ||
                            item.description ||
                            item.feature ||
                            item.name ||
                            item.finding ||
                            item.opportunity ||
                            item.recommendation ||
                            Object.values(item).join(" — ");

                        return `<li>${value}</li>`;
                    }

                    return `<li>${item}</li>`;

                }).join("")}
            </ul>
        `;
    }

    // If AI returned one object instead of an array
    if (typeof items === "object") {

        return `
            <ul>
                ${Object.values(items).map(item => `
                    <li>${item}</li>
                `).join("")}
            </ul>
        `;
    }

    // Final fallback
    return `<p>${items}</p>`;
};

        resultsDiv.innerHTML = `
            <div class="research-header">
                <h2>✨ Research-Powered Idea Improvement</h2>
                <p>
                    Your idea has been improved using real research.
                </p>
            </div>

            <div class="research-card">
                <h3>🚀 Improved Idea</h3>
                <p>${improvement.improved_idea || "No data available."}</p>
            </div>

            <div class="research-grid">

                <div class="research-card">
                    <h3>💡 Why It's Better</h3>
                    ${createList(improvement.why_better)}
                </div>

                <div class="research-card">
                    <h3>🆕 New Features</h3>
                    ${createList(improvement.new_features)}
                </div>

                <div class="research-card">
                    <h3>🎯 Target Users</h3>
                    ${createList(improvement.target_users)}
                </div>

                <div class="research-card">
                    <h3>🏆 Unique Advantage</h3>
                    <p>
                        ${improvement.unique_advantage || "No data available."}
                    </p>
                </div>

                <div class="research-card">
                    <h3>🛠️ MVP Plan</h3>
                    ${createList(improvement.mvp_plan)}
                </div>

                <div class="research-card">
                    <h3>➡️ Next Step</h3>
                    <p>
                        ${improvement.next_step || "No data available."}
                    </p>
                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        resultsDiv.innerHTML = `
            <div class="research-error">
                <h2>❌ Something went wrong</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}
// ==============================
// CREATE LIST FOR AI RESULTS
// ==============================

function createList(text) {

    if (!text) {
        return "<p>No information available.</p>";
    }

    if (Array.isArray(text)) {
        return `
            <ul>
                ${text.map(item => `<li>${item}</li>`).join("")}
            </ul>
        `;
    }

    return `
        <p>${String(text).replace(/\n/g, "<br>")}</p>
    `;
}
